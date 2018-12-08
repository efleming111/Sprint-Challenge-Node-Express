const express = require('express');

const actionsDB = require('./data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res)=>{
    actionsDB.get()
    .then(actions=>{
        res.json(actions);
    })
    .catch(error=>{
        res.status(500).json({error: 'The information could not be retrieved'});
    })
})

router.get('/:id', (req, res)=>{
    const {id} = req.params;
    actionsDB.get(id)
    .then(actions=>{
        if(actions){
            res.json(actions);
        }
        else{
            res.status(500).json({error: 'The information could not be retrieved.'});
        }
    })
    .catch(error=>{
        res.status(404).json({message: 'Action not found.'});
    })
})

router.post('/', (req, res)=>{
    const newAction = req.body;
    if(newAction.project_id && newAction.description && newAction.notes){
        if(newAction.description.length < 128){
            actionsDB.insert(newAction)
            .then(createdAction=>{
                res.json(createdAction);
            })
            .catch(error=>{
                res.status(500).json({error: 'The information could not be added'});
            })
        }
        else{
            res.status(400).json({errorMessage: 'The actions description is 128 max characters'});
        }
    }
    else{
        res.status(400).json({errorMessage: 'Please provide a action id, description and/or notes'});
    }
})

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    actionsDB.get(id)
    .then(actionToDelete=>{
        if(actionToDelete){
            actionsDB.remove(id)
            .then(count=>{
                if(count){
                    res.json(actionToDelete);
                }
                else{
                    res.status(500).json({error: 'The action could not be removed'});
                }
            })
        }
        else{
            res.status(404).json({message: 'Action not found'});
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The action could not be removed'})
    })
})

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const action = req.body;
    if(action.description.length < 128){
        actionsDB.update(id, action)
        .then(updatedAction=>{
            if(updatedAction){
                res.json(updatedAction)
            }
            else{
                res.status(404).json({message: 'Action could not be found'});
            }
        })
        .catch(error=>{
            res.status(500).json({error: 'The action could not be modified.'})
        })
    }
    else{
        res.status(400).json({errorMessage: 'The actions description is 128 max characters'});
    }
})

module.exports = router;
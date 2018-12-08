const express = require('express');

const projectsDB = require('./data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res)=>{
    projectsDB.get()
    .then(projects=>{
        res.json(projects);
    })
    .catch(error=>{
        res.status(500).json({error: 'The information could not be retrieved'});
    })
})

router.get('/:id', (req, res)=>{
    const {id} = req.params;
    projectsDB.getProjectActions(id)
    .then(actions=>{
        if(actions.length){
            res.json(actions);
        }
        else{
            res.status(404).json({message: 'Project has no actions'});
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The information could not be retrieved'});
    })
})

router.post('/', (req, res)=>{
    const newProject = req.body;
    if(newProject.name && newProject.description){
        if(newProject.name.length < 128){
            projectsDB.insert(newProject)
            .then(createdProject=>{
                res.json(createdProject);
            })
            .catch(error=>{
                res.status(500).json({error: 'The information could not be added'});
            })
        }
        else{
            res.status(400).json({errorMessage: 'The projects name is 128 max characters'});
        }
    }
    else{
        res.status(400).json({errorMessage: 'Please provide a project name and/or description'});
    }
})

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    projectsDB.get(id)
    .then(projectToDelete=>{
        if(projectToDelete){
            projectsDB.remove(id)
            .then(count=>{
                if(count){
                    res.json(projectToDelete);
                }
                else{
                    res.status(500).json({error: 'The project could not be removed'});
                }
            })
        }
        else{
            res.status(404).json({message: 'Project not found'});
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The project could not be removed'})
    })
})

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const project = req.body;
    if(project.name.length < 128){
        projectsDB.update(id, project)
        .then(updatedProject=>{
            if(updatedProject){
                res.json(updatedProject)
            }
            else{
                res.status(404).json({message: 'Project could not be found'});
            }
        })
        .catch(error=>{
            res.status(500).json({error: 'The project could not be modified.'})
        })
    }
    else{
        res.status(400).json({errorMessage: 'The projects name is 128 max characters'});
    }
})

module.exports = router;
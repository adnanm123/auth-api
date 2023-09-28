const express = require('express');
const authMiddleware = require('../auth/middleware/bearer');
const permissionsMiddleware = require('../auth/middleware/acl');
const dataModules = require('../models');

const router = express.Router();

router.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
      req.model = dataModules[modelName];
      next();
    } else {
      next('Invalid Model');
    }
  });

//  Requires bearer token authentication
router.use(authMiddleware);

//  Requires authentication only
router.get('/:model', handleGetAll);

//  Requires bearer token and 'create' capability
router.post('/:model', permissionsMiddleware('create'), handleCreate);

//  Requires bearer token and 'update' capability
router.put('/:model/:id', permissionsMiddleware('update'), handleUpdate);

//  Requires bearer token and 'delete' capability
router.delete('/:model/:id', permissionsMiddleware('delete'), handleDelete);

async function handleGetAll(req, res) {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  }
  
  async function handleCreate(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  }
  
  async function handleUpdate(req, res) {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
  }
  
  async function handleDelete(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  }

module.exports = router;

'use strict';

const path = require('path');
const express = require('express');
const xss = require('xss');
const InventoryService = require('./inventory-service');

const inventoryRouter = express.Router();
const jsonParser = express.json();

const serializeInventory = inventory => ({
  id: inventory.id,
  inventory_name: xss(inventory.inventory_name)
});

inventoryRouter
  .route('/')
  .get((req, res, next) => {
    InventoryService.getAllInventory(
      req.app.get('db')
    )
      .then(inventory => {
        res.json(inventory);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { inventory_name } = req.body;
    const newInventory = { inventory_name };
  
    for (const [key, value] of Object.entries(newInventory)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    InventoryService.insertInventory(
      req.app.get('db'),
      newInventory
    )
      .then(inventory => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${inventory.id}`))
          .json(serializeInventory(inventory));
      })
      .catch(next);
  });
  
inventoryRouter
  .route('/:inventory_id')
  .all((req, res, next) => {
    InventoryService.getById(
      req.app.get('db'), 
      req.params.inventory_id
    )
      .then(inventory => {
        if (!inventory) {
          return res.status(404).json({
            error: { message: 'Inventory doesn\'t exist' }
          });
        }
        res.inventory = inventory;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeInventory(res.inventory));
  })
  .delete((req, res, next) => {
    InventoryService.deleteInventory(
      req.app.get('db'),
      req.params.inventory_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { inventory_name } = req.body;
    const inventoryToUpdate = { inventory_name };
    //const numberOfValues = Object.values(inventoryToUpdate).filter(Boolean).length;
    //if(numberOfValues === 0){
    if(!inventory_name){
      return res.status(400).json({
        error: { message: 'Request body must contain a \'inventory_name\''}
      });
    }
  
    InventoryService.updateInventory(
      req.app.get('db'),
      req.params.inventory_id,
      inventoryToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });
  
module.exports = inventoryRouter;
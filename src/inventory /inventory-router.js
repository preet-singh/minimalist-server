'use strict';

const path = require('path');
const express = require('express');
const xss = require('xss');
const InventoryService = require('./inventory-service');

const inventoryRouter = express.Router();
const jsonParser = express.json();

const serializeInventory = inventory => ({
  id: inventory.id,
  inventory_name: xss(inventory.inventory_name),
  user_id: inventory.user_id,
});

// const serializeInventoryItem = item => ({
//   id: item.id,
//   item_name: xss(item.item_name),
//   item_description: xss(item.item_description),
//   item_action: xss(item.item_action),
//   inventory_id: item.inventory_id
// });

inventoryRouter
  .route('/')
  .get((req, res, next) => {
    InventoryService.getAllInventory(req.app.get('db'))
      .then(inventory => res.json(inventory.map(serializeInventory)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { inventory_name, user_id } = req.body;
    const newInventory = { inventory_name, user_id };
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
  .route('/:id')
  .all((req, res, next) => {
    InventoryService.getById(
      req.app.get('db'), 
      req.params.id
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
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { inventory_name, user_id } = req.body;
    const newInventoryFields = { inventory_name, user_id };
    //const numberOfValues = Object.values(inventoryToUpdate).filter(Boolean).length;
    //if(numberOfValues === 0){
    if(!inventory_name){
      return res.status(400).json({
        error: { message: 'Request body must contain an inventory_name'}
      });
    }
    if(!user_id){
      return res.status(400).json({
        error: { message: 'Request body must contain a user_id'}
      });
    }
  
    InventoryService.updateInventory(
      req.app.get('db'),
      req.params.id,
      newInventoryFields
    )
      .then( () => res.status(204).end())
      .catch(next);
  });

// inventoryRouter
//   .route('/:inventoryId/items')
//   .get((req, res, next) => {
//     InventoryService.getItemsForInventory(
//       req.app.get('db'),
//       req.params.inventory_id
//     )
//       .then(items => {
//         res
//           .status(201)
//           .json(items.map(serializeInventoryItem));
//       })
//       .catch(next);
//   });
  
module.exports = inventoryRouter;

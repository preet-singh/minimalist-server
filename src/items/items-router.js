/* eslint-disable quotes */
'use strict';
const path = require('path');
const express = require('express');
const xss = require('xss');
const ItemsService = require('./items-service');

const itemsRouter = express.Router();
const jsonParser = express.json();

const serializeItem = item => ({
  id: item.id,
  item_name: xss(item.item_name),
  item_description: xss(item.item_description),
  item_action: xss(item.item_action),
  inventory_id: item.inventory_id,
});
  
itemsRouter
  .route('/')
  .get((req, res, next) => {
    ItemsService.getAllItems(req.app.get('db'))
      .then(items => res.json(items.map(serializeItem)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { item_name, item_description, item_action, inventory_id } = req.body;
    const newItem = { item_name, item_description, item_action, inventory_id };

    for (const [key, value] of Object.entries(newItem)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing '${key}' in request body` 
        });
      }
    }
    ItemsService.insertItem(req.app.get('db'), newItem)
      .then(item => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${item.id}`))
          .json(serializeItem(item));
      })
      .catch(next);
  });

itemsRouter
  .route('/:id')
  .all((req, res, next) => {
    ItemsService.getById(
      req.app.get('db'), 
      req.params.id
    )
      .then(item => {
        if (!item) {
          return res.status(404).json({
            error: `Item doesn't exist` 
          });
        }
        res.item = item;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeItem(res.item));
  })
  .delete((req, res, next) => {
    ItemsService.deleteItem(req.app.get('db'), req.params.id)
      .then(() => res.status(204).end())
      .catch(next);    
  })
  .patch(jsonParser, (req, res, next) => {
    const { item_name, item_description, item_action } = req.body;
    const newItemFields = { item_name, item_description, item_action };
    const numberOfValues = Object.values(newItemFields).filter(Boolean).length;
    if(numberOfValues === 0){
      return res.status(400).json({
        error: { message: `Request body must contain a 'item_name', 'item_description', or 'item_action' `}
      });
    }

    ItemsService.updateItem(req.app.get('db'), req.params.id, newItemFields)
      .then( () => res.status(204).end())
      .catch(next);
  });

module.exports = itemsRouter;
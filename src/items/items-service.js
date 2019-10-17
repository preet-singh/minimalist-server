'use strict';

const ItemsService = {
  getAllItems(knex) {
    return knex.select('*').from('minimalist_items');
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('minimalist_items')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.select('*').from('minimalist_items').where('id', id).first();
  },
  deleteItem(knex, id){
    return knex.select('*').from('minimalist_items').where('id', id).delete();
  },
  updateItem(knex, id, newItemFields) {
    return knex('minimalist_item')
      .where({ id })
      .update(newItemFields);
  }
};
module.exports = ItemsService;
'use strict';

const InventoryService = {
  getAllInventory(knex) {
    return knex.select('*').from('minimalist_inventory');
  },
  insertInventory(knex, newInventory) {
    return knex
      .insert(newInventory)
      .into('minimalist_inventory')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.select('*').from('minimalist_inventory').where('id', id).first();
  },
  deleteInventory(knex, id){
    return knex.select('*').from('minimalist_inventory').where({ id }).delete();
  },
  updateInventory(knex, id, newInventoryFields) {
    return knex('minimalist_inventory')
      .where({ id })
      .update(newInventoryFields);
  }
};
module.exports = InventoryService;
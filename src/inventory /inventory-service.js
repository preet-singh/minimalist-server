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
    return knex.select('*').from('minimalist_inventory').where('id', id).delete();
  },
  updateInventory(knex, id, newInventoryFields) {
    return knex('minimalist_inventory')
      .where({ id })
      .update(newInventoryFields);
  },
  // getItemsForInventory(knex, inventory_id) {
  //   return knex
  //     .select('*')
  //     .from('minimalist_items')
  //     .where('minimalist_items.inventory_id', inventory_id)
  //     .groupBy('minimalist_items.id', 'user.id');
  // },

};
module.exports = InventoryService;
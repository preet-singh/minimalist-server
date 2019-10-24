'use strict';
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
    },
  ]
}

function makeInventoryArray(users) {
  return [
    {
      id: 1,
      inventory_name: 'First test inven!',
      user_id: users[0].id,
    },
    {
      id: 2,
      inventory_name: 'Second test inven!',
      user_id: users[1].id,
    },
    {
      id: 3,
      inventory_name: 'Third test inven!',
      user_id: users[2].id,
    },
    {
      id: 4,
      inventory_name: 'Fourth test inven!',
      user_id: users[3].id,

    },
  ]
}

function makeItemsArray(users, inventory) {
  return [
    {
      id: 1,
      item_name: 'First item name!',
      item_description: 'First item desc',
      item_action: 'First item action',
      inventory_id: inventory[0].id,
    },
    {
      id: 2,
      item_name: 'First item name!',
      item_description: 'First item desc',
      item_action: 'First item action',
      inventory_id: inventory[0].id,
    },
    {
      id: 3,
      item_name: 'First item name!',
      item_description: 'First item desc',
      item_action: 'First item action',
      inventory_id: inventory[0].id,
    },
    {
      id: 4,
      item_name: 'First item name!',
      item_description: 'First item desc',
      item_action: 'First item action',
      inventory_id: inventory[0].id,
    },
    {
      id: 5,
      item_name: 'First item name!',
      item_description: 'First item desc',
      item_action: 'First item action',
      inventory_id: inventory[0].id,
    },
  ];
}

function makeExpectedInventory(users, inventory, items=[]) {
  const author = users
    .find(user => user.id === inventory.author_id)

  const number_of_items = items
    .filter(item => item.inventory_id === item.id)
    .length
  
  const data = {
    id: inventory.id,
    inventory_name: inventory.inventory_name,
    user_id: inventory.user_id,
  }
  //console.log('EXPECTED INVEN');
  //console.log(inventory);
  return data;
  // return {
  //   id: inventory.id,
  //   inventory_name: inventory.inventory_name,
  //   user_id: inventory.user_id,
     //number_of_items
   //}
}

function makeExpectedInventoryItems(users, inventoryId, items) {
  const expectedItems = items
    .filter(item => item.inventory_id === inventoryId)

  return expectedItems.map(item => {
    const itemUser = users.find(user => user.id === item.user_id)
    return {
      id: item.id,
      item_name: item.item_name,
      item_description: item.item_description,
      item_action: item.item_action,
      user: {
        id: itemUser.id,
        user_name: itemUser.user_name,
        full_name: itemUser.full_name,
        nickname: itemUser.nickname,
      }
    }
  })
}

function makeMaliciousInventory(user) {
  const maliciousInventory = {
    id: 911,
    inventory_name: `Naughty naughty very naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id
  }
  const expectedInventory = {
    ...makeExpectedInventory([user], maliciousInventory),
    inventory_name: `Naughty naughty very naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    //user_id: user.id
  }
  return {
    maliciousInventory,
    expectedInventory,
  }
}

function makeInventoryFixtures() {
  const testUsers = makeUsersArray()
  const testInventory = makeInventoryArray(testUsers)
  const testItems = makeItemsArray(testUsers, testInventory)
  return { testUsers, testInventory, testItems }
}

function cleanTables(db) {
  return db.transaction(trx => 
    trx.raw(
      `TRUNCATE
        minimalist_users,
        minimalist_inventory,
        minimalist_items
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE minimalist_inventory_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE minimalist_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE minimalist_items_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('minimalist_inventory_id_seq', 0)`),
        trx.raw(`SELECT setval('minimalist_users_id_seq', 0)`),
        trx.raw(`SELECT setval('minimalist_items_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('minimalist_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('minimalist_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedInventoryTables(db, users, inventory, items=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('minimalist_inventory').insert(inventory)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('minimalist_inventory_id_seq', ?)`,
      [inventory[inventory.length - 1].id],
    )
    // only insert items if there are some, also update the sequence counter
    if (items.length) {
      await trx.into('minimalist_items').insert(items)
      await trx.raw(
        `SELECT setval('minimalist_items_id_seq', ?)`,
        [items[items.length - 1].id],
      )
    }
  })
}

function seedMaliciousInventory(db, user, inventory) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('minimalist_inventory')
        .insert([inventory])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeInventoryArray,
  makeExpectedInventory,
  makeExpectedInventoryItems,
  makeMaliciousInventory,
  makeItemsArray,
  
  makeInventoryFixtures,
  cleanTables,
  seedInventoryTables,
  seedMaliciousInventory,
  makeAuthHeader,
  seedUsers,
}
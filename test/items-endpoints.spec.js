'use strict';
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Items Endpoints', function() {
  let db;

  const {
    testInventory,
    testUsers,
  } = helpers.makeInventoryFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/items`, () => {
    beforeEach('insert inventory', () =>
      helpers.seedInventoryTables(
        db,
        testUsers,
        testInventory
      )
    );

    it(`creates an item, responding with 201 and the new item`, function() {
      this.retries(3);
      const testInven = testInventory[0];
      const testUser = testUsers[0];
      const newItem = {
        item_name: 'Test new item',
        item_description: 'Test new item desc',
        item_action: 'Test new item action',
        inventory_id: testInven.id,
      };
      console.log(newItem);
      return supertest(app)
        .post('/api/items')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.item_name).to.eql(newItem.item_name);
          expect(res.body.inventory_id).to.eql(newItem.inventory_id);
          //expect(res.body.user.id).to.eql(testUser.id);
          expect(res.headers.location).to.eql(`/api/items/${res.body.id}`);
        })
        .expect(res =>
          db
            .from('minimalist_items')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.item_name).to.eql(newItem.item_name);
              expect(row.item_description).to.eql(newItem.item_description);
              expect(row.item_action).to.eql(newItem.item_action);
              expect(row.inventory_id).to.eql(newItem.inventory_id);
              expect(row.user_id).to.eql(testUser.id);
            })
        );
    });

    // const requiredFields = ['new_item', 'item_description', 'item_action', 'inventory_id'];

    // requiredFields.forEach(field => {
    //   const testInven = testInventory[0];
    //   const testUser = testUsers[0];
    //   const newItem = {
    //     item_name: 'Test new item',
    //     item_description: 'Test new item desc',
    //     item_action: 'Test new item action',
    //     inventory_id: testInven.id,
    //   };

    //   it(`responds with 400 and an error message when the '${field}' is missing`, () => {
    //     delete newItem[field];

    //     return supertest(app)
    //       .post('/api/items')
    //       .set('Authorization', helpers.makeAuthHeader(testUser))
    //       .send(newItem)
    //       .expect(400, {
    //         error: `Missing '${field}' in request body`,
    //       });
    //   });
    // });
  });
});
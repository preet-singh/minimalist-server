'use strict';
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Inventory Endpoints', function() {
  let db;

  const {
    testUsers,
    testInventory,
    testItems,
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

  describe('GET /api/inventory', () => {
    context('Given no inventory', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/inventory')
          .expect(200, []);
      });
    });

    context('Given there are inventory in the database', () => {
      beforeEach('insert inventory', () =>
        helpers.seedInventoryTables(
          db,
          testUsers,
          testInventory,
          testItems
        )
      );

      it('responds with 200 and all of the inventory', () => {
        //console.log('TEST INVEN');
        //console.log(testInventory);
        const expectedInventory = testInventory.map(inventory => {
          const ei = helpers.makeExpectedInventory(
            testUsers,
            inventory,
            testItems
          );
          return ei; 
          //console.log('EXPECTED INVEN');
          //console.log(ei);
        }
        );
        //console.log('EXPECTED INVENTORY');
        //.log(expectedInventory);
        return supertest(app)
          .get('/api/inventory')
          .expect(200, expectedInventory);
      });
    });

    context('Given an XSS attack inventory', () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousInventory,
        expectedInventory,
      } = helpers.makeMaliciousInventory(testUser);

      beforeEach('insert malicious inventory', () => {
        return helpers.seedMaliciousInventory(
          db,
          testUser,
          maliciousInventory
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/inventory')
          .expect(200)
          .expect(res => {
            expect(res.body[0].inventory_name).to.eql(expectedInventory.inventory_name);
          });
      });
    });
  });

  describe('GET /api/inventory/:inventory_id', () => {
    context('Given no inventory', () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      );

      it('responds with 404', () => {
        const inventoryId = 123456;
        return supertest(app)
          .get(`/api/inventory/${inventoryId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: 'Inventory doesn\'t exist' } });
      });
    });

    context('Given there are inventory in the database', () => {
      beforeEach('insert inventory', () =>
        helpers.seedInventoryTables(
          db,
          testUsers,
          testInventory,
          testItems
        )
      );
      
      it('responds with 200 and the specified inventory', () => {
        const inventoryId = 2;
        const expectedInventory = helpers.makeExpectedInventory(
          testUsers,
          testInventory[inventoryId - 1],
          testItems
        );console.log(expectedInventory);
        return supertest(app)
          .get(`/api/inventory/${inventoryId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedInventory);
      });
     
    });

    context('Given an XSS attack inventory', () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousInventory,
        expectedInventory,
      } = helpers.makeMaliciousInventory(testUser);

      beforeEach('insert malicious inventory', () => {
        return helpers.seedMaliciousInventory(
          db,
          testUser,
          maliciousInventory
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/inventory/${maliciousInventory.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.inventory_name).to.eql(expectedInventory.inventory_name);
          });
      });
    });
  });
});
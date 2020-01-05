
Deployed at: https://evening-sea-10749.herokuapp.com/
# Minimalist
* Live version: https://minimalist-app.now.sh/
* Live link to API endpoints: https://evening-sea-10749.herokuapp.com/api

* Link to Server Repo: https://github.com/preet-singh/minimalist-server
* Link to Client Repo: https://github.com/preet-singh/minimalist-client


## Getting Started
* Clone the repository and install dependencies using ```npm install```
* Create local PostgreSQL databases:
  * ```minimalist```
  * ```minimalist-test```
* Create a ```.env``` file and provide the local database locations
  * Example: ```"postgresql://dunder_mifflin@localhost/minimalist"```
* Update the databases using ```npm run migrate``` and ```npm run migrate:test```
* Seed the database with dummy data using ```psql -U [username] -d minimalist -f ./seeds/seed.minimalist_tables.sql```
* Run the local server using ```npm run dev```
  
  
## Description
Minimalist API is the server responsible for handling API requests for the Minimalist application


## API Documentation

### Inventory Endpoints

### ▸ `GET /api/inventory`


This endpoint will return an array of the users inventory

**Example response**
```JSON
[
    {
        "id": 1,
        "inventory_name": "Clothing",
        "user_id": 1
    },
    {
        "id": 2,
        "inventory_name": "Footwear",
        "user_id": 1
    },
    {
        "id": 3,
        "inventory_name": "Bulky Goods",
        "user_id": 1
    },
]
```

### ▸ `POST /api/inventory/:inventory_id`

This endpoint allows a user to add inventory to their main list, and will <small>POST<small> that inventory to the database. 

**Example request**

```JavaScript
{
    body:{
        inventory_name: Clothing
    }
}
```

### ▸ `DELETE /api/inventory/:inventory_id`

This endpoint allows a user to remove an inventory posted to the database, specified by the `inventory_id`. 

### Item Endpoints

### ▸ `GET /api/item`

This endpoint will return an array of the users items

**Example response**
```JSON
[
    {
        "id": 1,
        "item_name": "Footwear",
        "item_description": "New dress shoes",
        "item_action": "Keep and organize in closet",
        "inventory_id": 4
    },
        {
        "id": 2,
        "item_name": "Footwear",
        "item_description": "Old garden shoes",
        "item_action": "Trash",
        "inventory_id": 4
    },
        {
        "id": 3,
        "item_name": "Bulky Items",
        "item_description": "Old Dryer",
        "item_action": "Use in the Garage",
        "inventory_id": 13
    }
]
```

### ▸ `POST /api/item/:item_id`

This endpoint allows a user to add an item to their inventory and will <small>POST<small> that item to the database. 

**Example request**

```JavaScript
{
    body:{
        item_name: Clothing,
        item_description: Old dress shirts,
        item_action: Trash,
        inventory_id: 1,
    }
}
```

### ▸ `DELETE /api/item/:item_id`

This endpoint allows a user to remove an item posted to the database, specified by the `item_id`. 

### ▸ `PATCH /api/item/:item_id`

This endpoint allows a user to edit an item and make the changes to the database. 


## Technologies
* NodeJS
* Express
* PostgreSQL
* Heroku


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


## Technologies
* NodeJS
* Express
* PostgreSQL

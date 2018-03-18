const credential = require('./credential');

const knex = require('knex');

const connect = () => knex({
    clinet: 'mysql',
    connection: {
        host: credential.dbUrl,
        user: credential.dbUser,
        password: credential.pass,
        database: credential.db
    }
});
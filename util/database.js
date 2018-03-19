const credential = require('./credential');

const knex = require('knex');

const connect = () => knex({
    client: 'mysql',
    connection: {
        host: credential.host,
        user: credential.user,
        password: credential.pass,
        database: credential.db,
    }
});

module.exports = {
    connect
};
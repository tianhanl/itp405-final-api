const credential = require('./credential');

const knex = require('knex');

const rowLimit = 12;

const connect = () => knex({
    client: 'mysql',
    connection: {
        host: credential.host,
        user: credential.user,
        password: credential.pass,
        database: credential.db,
    }
});

const getItems = (page = 1) => {
    const offsetNumber = (page - 1) * rowLimit;
    return connect()('items')
        .join('categories', 'items.category_id', '=', 'categories.id')
        .limit(rowLimit)
        .offset(offsetNumber)
        .select('items.id', 'items.name', 'price', 'img_url', 'description', 'release_date', 'categories.name as category_name');
};

const getCategories = () => {
    return connect()('categories');
};

const getTransactions = (page = 1) => {
    const offsetNumber = (page - 1) * rowLimit;
    return connect()('transactions')
        .join('users', 'transactions.user_id', '=', 'users.id')
        .join('items', 'transactions.item_id', '=', 'items.id')
        .limit(rowLimit)
        .offset(offsetNumber)
        .select('transactions.id', 'users.username', 'items.name as item_name', 'transactions.date', 'transactions.quantity', 'transactions.total');
};

const getTransactionsForUser = (user_id, page = 1) => {
    const offsetNumber = (page - 1) * rowLimit;
    return connect()('transactions')
        .join('users', 'transactions.user_id', '=', 'users.id')
        .join('items', 'transactions.item_id', '=', 'items.id')
        .limit(rowLimit)
        .offset(offsetNumber)
        .where({ user_id })
        .select('transactions.id', 'users.username', 'items.name as item_name', 'transactions.date', 'transactions.quantity', 'transactions.total')
};

const postTransaction = (userId, itemId, date, quantity, total) => {
    return connect()
        .insert({
            user_id: userId,
            item_id: itemId,
            date,
            quantity,
            total
        })
        .into('transactions');
};

module.exports = {
    connect,
    getItems,
    getCategories,
    getTransactions,
    getTransactionsForUser,
    postTransaction
};
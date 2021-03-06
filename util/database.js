require('dotenv').config();
const knex = require('knex');

const rowLimit = 12;

const connect = () =>
  knex({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  });

const getItems = (page = 1) => {
  const offsetNumber = (page - 1) * rowLimit;
  return connect()('items')
    .join('categories', 'items.category_id', '=', 'categories.id')
    .limit(rowLimit)
    .offset(offsetNumber)
    .select(
      'items.id',
      'items.name',
      'price',
      'img_url',
      'description',
      'release_date',
      'categories.name as category_name'
    );
};

const getItem = id => {
  return connect()('items')
    .join('categories', 'items.category_id', '=', 'categories.id')
    .limit(1)
    .where({ 'items.id': id })
    .select(
      'items.id',
      'items.name',
      'price',
      'img_url',
      'description',
      'release_date',
      'categories.name as category_name'
    );
};

const postItem = body => {
  return connect()('items').insert({
    ...body
  });
};

const updateItem = (id, body) => {
  return connect()('items')
    .where({ id: id })
    .update({
      ...body
    });
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
    .select(
      'transactions.id',
      'users.username',
      'items.name as item_name',
      'transactions.date',
      'transactions.quantity',
      'transactions.total'
    );
};

const getTransactionsForUser = (user_id, page = 1) => {
  const offsetNumber = (page - 1) * rowLimit;
  return connect()('transactions')
    .join('users', 'transactions.user_id', '=', 'users.id')
    .join('items', 'transactions.item_id', '=', 'items.id')
    .limit(rowLimit)
    .offset(offsetNumber)
    .where({
      user_id
    })
    .select(
      'transactions.id',
      'users.username',
      'items.name as item_name',
      'transactions.date',
      'transactions.quantity',
      'transactions.total'
    );
};

const postTransaction = (userId, itemId, date, quantity, total) => {
  return connect()
    .insert({
      user_id: userId,
      item_id: itemId,
      date: date,
      quantity: quantity,
      total
    })
    .into('transactions');
};

module.exports = {
  connect,
  getItem,
  getItems,
  postItem,
  updateItem,
  getCategories,
  getTransactions,
  getTransactionsForUser,
  postTransaction
};

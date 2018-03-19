const database = require('./database');

database
    .getItems()
    .then(rows => {
        console.log(rows);
        return database.getCategories();
    })
    .then(rows => console.log(rows));
const express = require('express');
const path = require('path');
const database = require('./util/database');

const app = express();

app.set('port', process.env.PORT || 3000);

// handle request for static files
// app.use(express.static(path.join(__dirname, 'dist')));

app.get('/categories', (req, res) => {
    database
        .getCategories()
        .then(rows => {
            const output = {
                categories: rows
            };
            res.json(output);
        })
        .catch(err => {
            console.log(err);
            next();
        });
});

app.get('/items', (req, res) => {
    database
        .getItems(req.query.page)
        .then(rows => {
            const output = {
                items: rows,
                page: 1
            };
            res.json(output);
        })
        .catch(err => {
            console.log(err);
            next();
        });
});

app.get('/transactions', (req, res) => {
    database
        .getTransactions(req.query.page)
        .then(rows => {
            const output = {
                transactions: rows,
                page: 1
            };
            res.json(output);
        })
        .catch(err => {
            console.log(err);
            next();
        });
});



// catch all requests for not existed routes
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Resource Not Found');
});

app.listen(app.get('port'), () => {
    console.log('Server Started');
});

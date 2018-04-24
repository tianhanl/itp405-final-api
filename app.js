const express = require('express');
const path = require('path');
const database = require('./util/database');
const bodyParser = require('body-parser');
const Validator = require('validatorjs');

let itemRules = {
  name: 'required',
  price: 'required',
  description: 'required',
  release_date: 'required',
  category_id: 'required'
};

const app = express();

app.set('port', process.env.PORT || 3000);

// handle request for static files
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.get('/categories', (req, res, next) => {
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

app.get('/items/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.json({
      message: 'An id must be specified'
    });
  } else {
    database
      .getItem(req.params.id)
      .then(rows => {
        if (!rows || rows.length < 1) {
          res.status(404);
          res.send();
        } else {
          res.json(rows[0]);
        }
      })
      .catch(e => {
        console.log(e);
        res.status(404);
        res.json(e);
      });
  }
});

app.get('/items', (req, res, next) => {
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

app.post('/items', (req, res) => {
  let validation = new Validator(req.body, itemRules);
  if (validation.passes()) {
    console.log(req.body);
    database
      .postItem(req.body)
      .then(rows => {
        console.log(rows);
        res.status(202);
        res.send();
      })
      .catch(e => {
        console.log(e);
        res.status(422);
        res.json(e);
      });
  } else {
    res.status(422);
    res.json(validation.errors);
  }
});

app.patch('/items/:id', (req, res) => {
  let validation = new Validator(req.body, itemRules);
  if (validation.passes()) {
    database
      .updateItem(req.params.id, req.body)
      .then(rows => {
        console.log(rows);
        res.json(rows);
      })
      .catch(e => {
        console.log(e);
        res.status(422);
        res.json(e);
      });
  } else {
    res.status(422);
    res.json(validation.errors);
  }
});

app.get('/transactions', (req, res, next) => {
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

app.post('/transactions', (req, res, next) => {
  console.log(req.body);
  const userId = Number.parseInt(req.body.userId);
  const itemId = Number.parseInt(req.body.itemId);
  const date = req.body.date;
  const quantity = Number.parseInt(req.body.quantity);
  const total = Number.parseInt(req.body.total);
  database
    .postTransaction(userId, itemId, date, quantity, total)
    .then(rows => {
      res.status(202);
      res.json(rows);
    })
    .catch(err => {
      console.log(err);
      res.status(422);
      res.send(err);
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

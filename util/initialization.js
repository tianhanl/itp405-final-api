const database = require('./database');

const categories = [
    { name: 'software' },
    { name: 'design' }
];

const items = [{
    name: 'Software A',
    price: 20,
    img_url: '',
    description: 'A useful software',
    release_date: '2017-12-12',
    category_id: 1
}, {
    name: 'Design A',
    price: 10,
    img_url: '',
    description: 'A useful design',
    release_date: '2017-11-5',
    category_id: 2
}];
// database
//     .connect()('categories')
//     .insert(categories)
//     .then(rows => console.log(rows))
//     .catch(err => console.log(err));

database
    .connect()('items')
    .insert(items)
    .then(rows => console.log(rows))
    .catch(err => console.log(err));



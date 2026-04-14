const engine = require('ejs-mate');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.engine('ejs', engine);

const port = 3000;

app.get('/', (req, res) => {
    res.render('welcome', {
        title: 'The Grand Sus | Welcome',
        headBlock: '<link rel="stylesheet" href="/welcome.css">',
        activePage: 'welcome'
    });
});

app.get('/fun', (req, res) => {
    res.render('fun', {
        title: 'The Grand Sus | Fun',
        headBlock: '<link rel="stylesheet" href="/fun.css">',
        activePage: 'fun'
    });
});

app.get('/socials', (req, res) => {
    res.render('socials', {
        title: 'The Grand Sus | Socials',
        headBlock: '<link rel="stylesheet" href="/socials.css">',
        activePage: 'socials'
    });
});

app.get('/boards', (req, res) => {
    res.render('boards', {
        title: 'The Grand Sus | Boards Collection',
        headBlock: '<link rel="stylesheet" href="/boards.css"><link rel="stylesheet" href="/viewer.css">',
        activePage: 'boards'
    });
});

app.get('/wish-boards', (req, res) => {
    res.render('wish-boards', {
        title: 'The Grand Sus | Boards Wishlist',
        headBlock: '<link rel="stylesheet" href="/boards.css"><link rel="stylesheet" href="/viewer.css">',
        activePage: 'wish-boards'
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
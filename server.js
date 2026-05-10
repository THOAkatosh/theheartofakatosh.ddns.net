const serveIndex = require('serve-index');
const engine = require('ejs-mate');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
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

app.get('/ag', (req, res) => {
    res.render('ag', {
        title: 'The Grand Sus | AG Servers',
        headBlock: '<link rel="stylesheet" href="/ag.css">',
        activePage: 'ag'
    });
});

app.use('/fastdl',
    express.static('/www/wwwroot/theheartofakatosh.ddns.net/public/fastdl/'),
    serveIndex('/www/wwwroot/theheartofakatosh.ddns.net/public/fastdl/', {
        icons: true
    })
);

app.get('/api/get-board-img', async (req, res) => {
    try {
        const { path: boardType, board } = req.query;
        if (!boardType || (boardType !== 'boards' && boardType !== 'wish-boards')) {
            return res.status(400).json({ 
                success: false, 
                error: 'Parameter path must be "boards" or "wish-boards"' 
            });
        }
        if (!board) {
            return res.status(400).json({ 
                success: false, 
                error: 'Specify board' 
            });
        }
        const allowedBase = path.join(__dirname, 'public', 'image', boardType);
        const fullPath = path.join(allowedBase, board);
        if (!fullPath.startsWith(allowedBase)) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied' 
            });
        }
        const files = await fs.readdir(fullPath);
        res.json({ 
            success: true, 
            files: files,
            count: files.length,
            path: `${boardType}/${board}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
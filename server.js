const express = require('express');
const path = require('path');
const fs = require('fs');
let notes = require('./db/db.json');
const { title } = require('process');
const uuid = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, res) => {
            if (err) {
                console.error(err);
            } else {
                const data = JSON.parse(res);
                data.push(newNote);
                notes = data;
                fs.writeFile('./db/db.json', JSON.stringify(data, null, 3),
                    (err2) => err2 ? console.error(err2) : console.info('Notes Updated!')
                );
            }
        });


        res.json({
            status: 'success',
            body: newNote,
        });
    }
    else
        res.json('Error in posting notes');

});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
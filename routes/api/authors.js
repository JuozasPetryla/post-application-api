const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/express.db')
const query = "SELECT * FROM Authors"


// Get all posts

router.get('/', (req, res) => {
    db.all(query, (err, author) => {
        if (err) console.log(err.message);
        res.send(author)
    })
})

// Get single author

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    db.get(`${query} WHERE id = ${req.params.id}`, (err, author) => {
        if (err) console.log(err.message)
        res.send(author)
    })
})

// Create new author

router.post('/', (req, res) => {
    // const db = new sqlite3.Database('./db/express.db')

    const date = new Date().toISOString().slice(0, 10)

    // const authors = db.get(query)

    // authors.serialize(function () {
    //     authors.run(
    //         `INSERT INTO Authors(name, surname, created_at, updated_at) 
    //     VALUES (
    //     "${req.body.name}",
    //     "${req.body.surname}",
    //     "${date}",
    //     "${date}")`
    //     )
    //     res.json()
    // })
    // db.close()

    const { name, surname } = req.body;

    if (!name || !surname) {
        return res.status(400).json({ error: 'Name and surname are required fields.' });
    }

    const query = `INSERT INTO authors (name, surname, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, surname, date, date], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating author.' });
        }
        res.status(200).json({ id: this.lastID });
    });
})

// Update author

router.put('/:id', (req, res) => {
    const db = new sqlite3.Database('./db/express.db')

    const date = new Date().toISOString().slice(0, 10)

    const author = db.get(query)

    const name = `${req.body.name ? `name = "${req.body.name}",` : ''}`
    const surname = `${req.body.surname ? `surname = "${req.body.surname}",` : ''}`

    author.serialize(function () {
        author.run(
            `UPDATE Authors 
        SET
        ${name}
        ${surname}
        updated_at = "${date}"
        WHERE id = ${req.params.id}`
        )
        res.json(author)
    })
    db.close()
})

// Delete author

router.delete('/:id', (req, res) => {
    const db = new sqlite3.Database('./db/express.db')

    const author = db.get(query)

    author.serialize(function () {
        author.run(
            `DELETE FROM Authors 
        WHERE id = ${req.params.id}`
        )
        res.json(author)
    })
    db.close()
})

module.exports = router
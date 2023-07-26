const express = require('express')
const path = require('path')

const app = express()


// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// HomePage route
app.get('/', (req, res) => res.json('index.html'))

// Set a static folder
app.use(express.static(path.join(__dirname, 'public')))

// Authors API route
app.use('/api/authors', require('./routes/api/authors'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
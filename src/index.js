const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use it before all route definitions
app.use(cors({ origin: '*' }))

//routes
app.use(require('../src/routes/index'))

app.get('/', (req, res) => {
    res.send('Hello sharito!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
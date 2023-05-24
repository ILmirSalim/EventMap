const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', routes)

const PORT = process.env.PORT || 3001

const start = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()
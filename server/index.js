const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
const fileRouter = require('./routes/file.routes')

require('dotenv').config()

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', routes)
app.use('/api/files', fileRouter)

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
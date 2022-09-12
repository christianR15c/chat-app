const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')


const app = express()

app.use(express.json())

dotenv.config()
connectDB()

app.get('/', (req, res) => {
    res.json({ message: 'API is running' })
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 8000, console.log('server is running on port 8000'.yellow.bold))
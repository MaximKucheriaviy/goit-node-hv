const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require("dotenv");
const mongoose = require("mongoose");


const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users');

dotenv.config();


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  if(err.status !== 500 && err.status){
    res.status(err.status).json({ message: err.message })
    return;
  }
  res.status(500).json({ message: err.message })
})


mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION_DATA)
.then(() => {
  console.log("Database connection successful");
})
.catch(err => {
  console.log("Connection error");
  console.log(err);
})

module.exports = app

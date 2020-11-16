const express = require('express')
const app = express()
const mongoose = require('mongoose')
const insframeRouter = require('./routes/insframe')
const bodyParser = require('body-parser')
const { mongoUri, PORT } = require('./config')

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))


// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use('/font', express.static(__dirname + '/public/font'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(insframeRouter)

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const insframeRouterAPI = require('./routes/insframeAPI')
const insframeContent = require('./routes/insframeContent')
const insframeAuth = require('./routes/insframeAuth')
const insframeProfile = require('./routes/insframeProfile')
const { mongoUri, PORT } = require('./config')
const cors = require('cors')


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

app.use(express.static(__dirname + '/public'));
app.use('/sign',express.static(__dirname + '/public'));
app.use('/profile',express.static(__dirname + '/public'));
app.use('/category',express.static(__dirname + '/public'));


// Set Views
app.use(expressLayouts)
app.set('layout', './layouts/layout')
// app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use('/sign',insframeAuth)
app.use('/profile',insframeProfile)
app.use('/api/images',insframeRouterAPI)
app.use(insframeContent)

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))

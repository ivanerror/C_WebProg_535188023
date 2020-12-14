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
var cookieParser = require('cookie-parser');
var session = require('express-session');

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
app.use('/profile/collection',express.static(__dirname + '/public'));
app.use('/profile/photos',express.static(__dirname + '/public'));
app.use('/category',express.static(__dirname + '/public'));
app.use('/search',express.static(__dirname + '/public'));
app.use('/photo',express.static(__dirname + '/public'));
app.use('/popular',express.static(__dirname + '/public'));
app.use('/upload',express.static(__dirname + '/public'));



// Set Views
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
//configure the options however you need them, obviously
app.use(expressLayouts)
app.use(cookieParser());

app.set('layout', './layouts/layout')
// app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use('/sign',insframeAuth)
app.use('/profile',insframeProfile)
app.use('/api/images',insframeRouterAPI)
app.use(insframeContent)

app.get("*", async (req, res) => {
    res.render("404", { layout: false });
  });

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))

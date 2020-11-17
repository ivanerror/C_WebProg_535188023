const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const insframeRouterAPI = require('./routes/insframeAPI')
const insframeRouterPAGE = require('./routes/insframePAGE')
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


// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use('/api/images',insframeRouterAPI)
app.use(insframeRouterPAGE)

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))

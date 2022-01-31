const req = require('express/lib/request')
const mongoose = require('mongoose')
const env = require(`../environment/${process.env.NODE_ENV}`)

exports.clientPromise = mongoose
    .connect(env.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .catch(err => console.log(err))

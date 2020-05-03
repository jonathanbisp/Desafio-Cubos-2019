const express = require('express')
const consign = require('consign')

const app = express()

consign()
    .include('./data/db.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./config')
    .into(app)

app.listen(3000, ()=> {
    console.log('Backend executando...');
})

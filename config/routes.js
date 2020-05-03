module.exports = app => {
    app.post('/createUser', app.api.users.createUser )
    app.get('/getUsers', app.api.users.getUsers)
    app.get('/getUserById/:id', app.api.users.getUserById)
    app.delete('/removeUserById/:id', app.api.users.removeUserById)

    app.post('/addToLine/:id', app.api.line.addToLine)
    app.get('/findPositionById/:id', app.api.line.findPositionById)
    app.get('/findPositionById', app.api.line.findPosition)
    app.get('/showLine', app.api.line.showLine)
    app.delete('/popLine', app.api.line.popLine)
    app.get('/filterLine/:gender', app.api.line.filterLine)
}
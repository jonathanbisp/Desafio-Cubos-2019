module.exports = app => {
    
    const validEmailOrError = (email, msg) => {
        const mailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!mailRe.test(email)) throw msg 
    }

    const uniqueEmailOrError = (email, msg) => {
        const users = app.data.db.loadUsers()
        users.forEach((user) => {
            if(user.email === email) throw msg
        })
    }

    const existsOrError = (value, msg) => {
        if(!value) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
    }
    
    const isAlphabetic = (value, msg) => {
        const alphaRe = /^[A-Za-záâãéêôõóíúç\.\ ]+$/
        value = value.trim()
        if(!value.match(alphaRe)) throw msg
    }

    const maleFemaleOtherOrError = (value, msg) => {
        if(value.length != 1) throw msg
        value = value.toUpperCase()
        if(!('MFO'.includes(value))) throw msg
    }

    const isInteger = (value, msg) =>{
        value = value.trim()
        const integerRe = /^\d+$/
        if(!value.match(integerRe)) throw msg
    }

    const integerPlusThan0OrError = (value, msg) => {
        isInteger(value, msg)
        if(value < 1) throw msg
    }

    const idInUsersOrError = (value, msg) => {
        const users = app.data.db.loadUsers()
        let finded = false
        let index = null

        for(let i = 0; i < users.length; i++){
            if(users[i].id == value){
                finded = true
                index = i
                break
            }
        }
        if(!finded) throw msg
        return index
    }

    const idNotInLineOrError = (value, msg) =>{
        const line = app.data.db.loadLine()
        for(let i = 0; i < line.length; i++){
            if(line[i] == value) throw msg
        }
    }

    const idInLineOrError = (value, msg) => {
        try{
            idNotInLineOrError(value,'Param inválido: Usuário já está na fila.')
        } catch (msg){
            return
        }
        throw msg
    }

    const emailInUsersOrError = (value, msg) => {
        let finded = false
        let index = null

        const users = app.data.db.loadUsers()

        for(let i = 0; i < users.length; i++){
            if(users[i].email == value){
                finded = true
                index = i
                break
            }
        }
        if(!finded) throw msg
        return index
    }

    return { validEmailOrError, uniqueEmailOrError,
             existsOrError, isAlphabetic, 
             maleFemaleOtherOrError, integerPlusThan0OrError,
             idInUsersOrError, idNotInLineOrError,
             idInLineOrError, emailInUsersOrError }
}

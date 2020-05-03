module.exports = app => {

    const { validEmailOrError, uniqueEmailOrError,
        existsOrError, isAlphabetic, 
        maleFemaleOtherOrError , integerPlusThan0OrError,
        idInUsersOrError
    } = app.api.validator

    const createUser = (req, res) =>{
        
        const user = req.body
        
        try{

            existsOrError(user.name, 'Body inválido: Nome não informado.')
            user.name = user.name.trim()
            isAlphabetic(user.name, 'Body inválido: Nome inválido, informe somente letras do alfabeto e pontos.')

            existsOrError(user.gender, 'Body inválido: Gênero não informado.')
            user.gender = user.gender.trim()
            user.gender = user.gender.toUpperCase()
            isAlphabetic(user.gender, 'Body inválido: Bah, gêneros devem ser expressos em letras.')
            maleFemaleOtherOrError(user.gender, 'Body inválido: Por enquanto aceitamos somente: M - Masculino, F - Femenino, O - O que você quiser.')

            existsOrError(user.email, 'Body inválido: E-mail não informado.')
            user.email = user.email.trim().toLowerCase()
            validEmailOrError(user.email, 'Body inválido: E-mail inválido.')
            uniqueEmailOrError(user.email, 'Body inválido: E-mail já cadastrado.')
                     
        } catch (msg){
            return res.status(400).send(msg)
        }
        const users = app.data.db.loadUsers()
        
        try{
            user.id = (users[users.length-1].id + 1)
        } catch (_){
            user.id = 1
        }
        
        users.push(user)
        app.data.db.saveUsers(users)
        return res.status(200).send(user)
    }

    const getUsers = (req, res) =>{
        const users = app.data.db.loadUsers()
        return res.json(users)
    }

    const getUserById = (req, res) => {
        
        try{
            integerPlusThan0OrError(req.params.id, 'Param inválido: Deve ser inteiro maior que zero.')
        }catch (msg){
            return res.status(400).send(msg)
        }

        const paramId = req.params.id
        const users = app.data.db.loadUsers()

        let achou = false
        for(let i = 0; i < users.length; i++){
            if(users[i].id == paramId) achou = users[i]
        }
        if(!achou) return res.status(400).send('Param inválido: Úsuario não cadastrado')
        
        return res.json(achou)
    }

    const removeUserById = (req, res) => {
        const users = app.data.db.loadUsers()
        try{
            integerPlusThan0OrError(req.params.id, 'Param inválido: Deve ser inteiro maior que zero.')
            const index = idInUsersOrError(req.params.id, 'Param inválido: Usúario não cadastrado')
            users.splice(index, 1)
            app.data.db.saveUsers(users)
            return res.status(204).send()
        }catch (msg){
            return res.status(400).send(msg)
        }
    }

    return { createUser, getUsers, getUserById, removeUserById }

}
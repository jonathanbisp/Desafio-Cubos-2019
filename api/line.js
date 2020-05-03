module.exports = app => {

    const { integerPlusThan0OrError, idInUsersOrError,
            idNotInLineOrError, idInLineOrError,
            validEmailOrError, existsOrError,
            emailInUsersOrError, maleFemaleOtherOrError } = app.api.validator
    
    const addToLine = (req, res) => {

        try{
            integerPlusThan0OrError(req.params.id, 'Param inválido: Deve ser inteiro maior que zero.')
            idInUsersOrError(req.params.id, 'Param inválido: Usuário não cadastrado.')
            idNotInLineOrError(req.params.id, 'Param inválido: Usuário já está na fila.')
        }catch (msg){
            return res.status(400).send(msg)
        }
        const line = app.data.db.loadLine()
        const intId = parseInt(req.params.id)
        
        line.push(intId)
        const pos = line.indexOf(intId) + 1
        app.data.db.saveLine(line)

        res.send({"position": pos })
    }

    const findPositionById = (req, res) => {
        try{
            integerPlusThan0OrError(req.params.id, 'Param inválido: Deve ser inteiro maior que zero.')
            idInUsersOrError(req.params.id, 'Param inválido: Usuário não cadastrado.')
            idInLineOrError(req.params.id, 'Param inválido: Usuário não está na fila.')
        }catch (msg){
            return res.status(400).send(msg)
        }
        
        const intId = parseInt(req.params.id)
        const line = app.data.db.loadLine()
        const pos = line.indexOf(intId) + 1

        res.send({"position": pos })
    }

    const showLine = (req, res) => {
        const line = app.data.db.loadLine()
        const users = app.data.db.loadUsers()

        const fullLine = []

        for(let i = 0; i < line.length; i++) {
            for (let j = 0; j < users.length; j++){
                if(line[i] == users[j].id) {
                    fullLine.push( {...users[j]} )
                    fullLine[i].position = (i + 1)
                }
            }
        }

        return res.json(fullLine)

    }

    const findPosition = (req, res) => {
        try {
            existsOrError(req.query.email, 'Query inválida: E-mail não informado')
            validEmailOrError(req.query.email, 'Query inválida: E-mail inválido')
            req.query.email = req.query.email.toLowerCase()
            const index = emailInUsersOrError(req.query.email, 'Query inválida: E-mail não cadastrado.')
            
            const line = app.data.db.loadLine()
            const users = app.data.db.loadUsers()

            const data = users[index]
            const id = data.id
            
            idInLineOrError(id, 'Query inválida: E-mail informado é de úsuario que não está na fila.')

            const position = (line.indexOf(id) + 1)

            data.position = position

            return res.json(data)
        } catch (msg){
            return res.status(400).send(msg)
        }
    }

    const popLine = (req, res) => {
        try{
            const line = app.data.db.loadLine()

            existsOrError(line, 'Fila vazia.')
            const users = app.data.db.loadUsers()

            const id = line.shift()
            app.data.db.saveLine(line)

            return res.json(users[idInUsersOrError(id)])
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const filterLine = (req, res) => {
        try {
            existsOrError(req.params.gender, 'Param inválido: Não informado')
            maleFemaleOtherOrError(req.params.gender, 'Param inválido: Por enquanto aceitamos somente: M - Masculino, F - Femenino, O - O que você quiser.')
            
            const line = app.data.db.loadLine()
            const users = app.data.db.loadUsers()            
            
            const filtered = []
            for(let i = 0; i < line.length; i++){
                for(let j = 0; j < users.length; j++){
                    if(line[i] == users[j].id){
                        if(users[j].gender == req.params.gender){
                            filtered.push({...users[j], position: (i+1) }) 
                        }
                    }
                }
            }

            return res.json(filtered)
        } catch(msg) {
        res.status(400).send(msg)
        }
    }
    return { addToLine, findPositionById, showLine, findPosition, popLine, filterLine }
}
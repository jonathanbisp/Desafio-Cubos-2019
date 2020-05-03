const fs = require('fs')
const usersPath = './data/users.json'
const linePath = './data/line.json'

module.exports = app => {
    const loadUsers = () => {
        const fileBuffer = fs.readFileSync(usersPath, 'utf-8')
        const contentJson = JSON.parse(fileBuffer)
        return contentJson
    }

    const saveUsers = (content) => {
        const contentString = JSON.stringify(content)
        return fs.writeFileSync(usersPath, contentString)
    }

    const loadLine = () => {
        const fileBuffer = fs.readFileSync(linePath, 'utf-8')
        const contentJson = JSON.parse(fileBuffer)
        return contentJson
    }

    const saveLine = (content) => {
        const contentString = JSON.stringify(content)
        return fs.writeFileSync(linePath, contentString)
    }

    return { loadUsers, saveUsers, loadLine, saveLine }
}
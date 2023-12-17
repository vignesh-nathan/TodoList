const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

function findTodo(id, todoList) {
    for(let i = 0; i < todoList.length; i++) {
        if(todoList[i].id == id) return i
    }
    return -1
}

function deleteAtIndex(index, todoList) {
    let newList = []
    for(let i = 0; i < todoList.length; i++) {
        if(i !== index) newList.push(todoList[i])
    }
    return newList
}

app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(path.resolve('index.html'))
})

app.get("/todos", (req, res) => {
    fs.readFile('todos.txt', 'utf-8', (err, data) => {
        todos = JSON.parse(data)
        res.send(todos)
    })  
})

app.get("/todos/:id", (req, res) => {
    let id = req.params.id
    fs.readFile('todos.txt', 'utf-8', (err, data) => {
        if (err) throw err
        const todos = JSON.parse(data)
        const todoIndex = findTodo(id, todos)
        if(todoIndex === -1) {
            res.status(404).send(`ID ${id} not found`)           
        } else {
            res.json(todos[todoIndex])
        }
    }) 
})

app.post("/todos", (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const newTodo = {
        "id": Math.floor(Math.random()*1000000),
        "title": title,
        "description": description,
        "completed": false
    }
    fs.readFile('./todos.txt', 'utf-8', (err, data) => {
        if (err) throw err
        let todoList = JSON.parse(data)
        todoList.push(newTodo)
        fs.writeFile('./todos.txt', JSON.stringify(todoList), (err) => {
            if (err) throw err
            res.status(201).json(newTodo)
        })
    })   
})


app.put("/todos/:id", (req, res) => {
    let id = req.params.id
    let body = req.body
    
    fs.readFile('./todos.txt', 'utf-8', (err, data) => {
        let todoList = JSON.parse(data)
        let todoIndex = findTodo(id, todoList)
        if(todoIndex === -1) {
            res.status(404).send("Item not found")
        } else {
            let updatedTodo = {
                id: todoList[todoIndex].id,
                title: body.title,
                description: body.description,
                completed: body.completed
            }
            todoList[todoIndex] = updatedTodo
            fs.writeFile('./todos.txt', JSON.stringify(todoList), (err) => {
                if (err) throw err
                res.status(201).json(updatedTodo)
            })
        }
    })   
})

app.delete("/todos/:id", (req, res) => {
    let id = req.params.id
    fs.readFile('./todos.txt', 'utf-8', (err, data) => {
        if(err) throw err
        let todos = JSON.parse(data)
        let todoIndex = findTodo(id, todos)
        if(todoIndex === -1) {
            res.status(404).send("Item not found")
            
        } else {
            todos = deleteAtIndex(todoIndex, todos)
            fs.writeFile('./todos.txt', JSON.stringify(todos), (err) => {
                if (err) throw err
                res.status(201).json(todos)
            })
        }
    })
})

app.get('*', (req, res) => {
    res.status(404).send("Invalid route")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})



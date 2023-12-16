const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

let counter = 0

let todos = {}

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
        todos = JSON.parse(data)
        if(todos[id]) {
            res.json(todos[id])
        } else {
            res.status(404).send(`ID ${id} not found`)
        }
    }) 
})

app.post("/todos", (req, res) => {
    const title = req.body.title
    const description = req.body.description
    counter = Math.floor(Math.random()*1000000)
    const newTodo = {
        "id": counter,
        "title": title,
        "description": description,
        "completed": false
    }
    fs.readFile('./todos.txt', 'utf-8', (err, data) => {
        let todoList = JSON.parse(data)
        todoList[counter] = newTodo
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
        if(todoList[id]) {
            todoList[id].title = body.title
            todoList[id].completed = body.completed
            fs.writeFile('./todos.txt', JSON.stringify(todoList), (err) => {
                if (err) throw err
                res.status(201).json(todoList[id])
            })
        } else {
            res.status(404).send("Item not found")
        }
    })   
})

app.delete("/todos/:id", (req, res) => {
    let id = req.params.id
    fs.readFile('./todos.txt', 'utf-8', (err, data) => {
        let todos = JSON.parse(data)
        if(todos[id]) {
            delete todos[id]
            fs.writeFile('./todos.txt', JSON.stringify(todos), (err) => {
                if (err) throw err
                res.json(todos)
            })
        } else {
            res.status(404).send("Item not found")
        }
    })
})

app.get('*', (req, res) => {
    res.status(404).send("Invalid route")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})



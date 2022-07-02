const express = require('express')
// const http = require('http'); // se comenta el http por que se instalo express
// commonjs module son los módulos creados por node ya que no existían los módulos en el navegador o js hasta ecma6, (hace un tiempo node le a dado soporte al los módulos de ecma6 y se pueden usar {import http from 'http'}pero es mejor acostumbrarse a la versión de node que tenga el soporte)
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors') // se hace la instalación de cors
const notesData = require('./DB/notes')

app.use(cors()) // se agrega el middleware cors para que se puedan hacer peticiones a la api y no aparezcan los errores de cors. en la carga de la api, en el navegador, se puede ver el error de cors.

app.use(express.json()) // regresa los request que tienen un objeto y los parsec en formato json

app.use(logger) // se le pasa el middleware al app
let notes = notesData

/* let notes = [
    {
        id: 1,
        content: 'HTML is easy and ',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only JavaScript',
        date: '2019-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2019-05-30T19:20:14.298Z',
        important: true
    }
] */

/* const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' }); // 200 es el código de respuesta que indica que la petición fue exitosa y el tipo de contenido que se va a enviar es texto plano
    res.end(JSON.stringify(notes));
});// se comenta por que se crea la app con express */
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
app.get('/notes', (req, res) => {
    res.json(notes)
})
app.get('/notes/:id', (req, res) => {
    const id = Number(req.params.id) // hay que transformar el id a un número por que los request los entragan en string
    const note = notes.find((note) => note.id === id) // para recuperar las notas que coincidan con el id

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end()
})

app.post('/notes', (req, res) => {
    const note = req.body

    if (!note || !note.content) {
        return res.status(400).json({
            error: 'note content is missing'
        })
    } // una forma de validar que el contenido de la nota no esté vacío

    const ids = notes.map((note) => note.id)
    const maxId = Math.max(...ids)

    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false, // se hace una verificación por si no ponen datos o  no se envía el important se le asigne false
        date: new Date().toISOString()
    }

    notes = notes.concat(newNote)
    // note = [...notes, newNote] es lo mismo que el anterior

    res.status(201).json(newNote)
})

app.use((req, res) => {
    console.log('404 path id:')
    console.log(req.path)
    res.status(404).json({
        error: 'not found'
    }) // si no se encuentra la ruta se le envía un error
})

const PORT = process.env.PORT || 3001 // las webs están por defecto en el puerto 80 pero las que son http, pero las https están por defecto en el puerto 443
/* app.listen(PORT) // se pone el comando proceso.env.PORT para que heroku pueda poner el puerto que quiere que use la app */
console.log(`Server running at http://localhost:${PORT}/`) // se tiene que poner un callback en el app.listen que lo pide express  */
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
})

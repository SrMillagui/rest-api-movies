const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie } = require('./schemas/movies')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://ejemplo.com'
]
if (ACCEPTED_ORIGINS.includes(origin)){
  return callback(null, true)
}
if (!origin){
  return callback(null, true)
}
return callback(new Error('Not Allowed by CORS'))
  }
}))
app.disable('x-powered-by') // Desabilita el powered de express en los titulos

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLocaleLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(), // Crea id random usando UUID v4
    ...result.data
  }
  movies.push(newMovie) // Sin usar REST, ira directo a memoria.
  res.status(201).json(newMovie) // Para actualizar la cache del cliente
})
// Delete
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

// PATCH
app.patch('/movies/:id', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening in PORT http://localhost:${PORT}`)
})
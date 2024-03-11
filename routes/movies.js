import { Router } from 'express'
import movies from '../movies.json' with { type: 'json' }
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export const moviesRouter = Router()
//Primer get
moviesRouter.get('/', (req, res) => {
    const { genre } = req.query
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLocaleLowerCase())
      )
      return res.json(filteredMovies)
    }
    res.json(movies)
  })
  //Segundo GET (Por id)
  moviesRouter.get('/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find((movie) => movie.id === id)
    if (movie) return res.json(movie)
  
    res.status(404).json({ message: 'Movie not found' })
  })
  //POST
  moviesRouter.post('/',  (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = {
      id: randomUUID(), // Crea id random usando UUID v4
      ...result.data
    }
    moviesRouter.push(newMovie) // Sin usar REST, ira directo a memoria.
    res.status(201).json(newMovie) // Para actualizar la cache del cliente
  })
//DEL
moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })
  //PATH
  moviesRouter.patch('/:id', (req, res) => {
    const result = validateMovie(req.body)
  
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const { id } = req.params
    const movieIndex = findIndex((movie) => movie.id === id)
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
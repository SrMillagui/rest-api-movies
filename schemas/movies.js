import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie Title must be string', //Ejemplo de texto error de tipeo
        required_error: 'Mobie Title is required'  //EJemplo de requerimiento
    }),
    year: z.number().int().min(1900).max(2024), //Se puede agregar varios requerimientos
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({//Se puede agregar mas como endwith(jpg)
        message: 'Poster must be a valid url' 
    }),
     genre: z.array(
  z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
{
  required_error: 'Movie genre is required.',
  invalid_type_error: 'Movie genre must be an array of enum Genre'
}
)
})

 export function validateMovie(input){
    return movieSchema.safeParse(input)
 }

 export function validatePartialMovie(input){
    return movieSchema.partial().safeParse(input)
 }
let request = require('supertest');
let { getAllMovies } = require('../controllers');
let { app } = require('../index.js');
let http = require('http');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllMovies: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe('Controller Function tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all movies', async () => {
    let mockMovies = [
      {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
      {
        movieId: 2,
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        director: 'Frank Darabont',
      },
      {
        movieId: 3,
        title: 'The Godfather',
        genre: 'Crime',
        director: 'Francis Ford Coppola',
      },
    ];

    getAllMovies.mockReturnValue(mockMovies);

    let result = await getAllMovies();
    expect(result).toEqual(mockMovies);
    expect(result.length).toBe(3);
  });
});

describe('API Endpoint tests', () => {
  it('GET /movies should get all movies', async () => {
    let res = await request(server).get('/movies');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      movies: [
        {
          movieId: 1,
          title: 'Inception',
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
        },
        {
          movieId: 2,
          title: 'The Shawshank Redemption',
          genre: 'Drama',
          director: 'Frank Darabont',
        },
        {
          movieId: 3,
          title: 'The Godfather',
          genre: 'Crime',
          director: 'Francis Ford Coppola',
        },
      ],
    });
    expect(res.body.movies.length).toBe(3);
  });

  it('GET /movies/details/:id should get a movie by ID', async () => {
    let res = await request(server).get('/movies/details/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      movie: {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
    });
  });
});

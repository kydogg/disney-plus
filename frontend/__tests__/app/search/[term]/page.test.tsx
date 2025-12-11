import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SearchPage from '@/app/search/[term]/page';
import { getSearchedMovies, getPopularMovies } from '@/lib/getMovies';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Mock getMovies functions
jest.mock('@/lib/getMovies', () => ({
  getSearchedMovies: jest.fn(),
  getPopularMovies: jest.fn(),
}));

// Mock MoviesCarousel component
jest.mock('@/components/MoviesCarousel', () => {
  return function MockMoviesCarousel({
    title,
    movies,
    isVertical,
  }: {
    title: string;
    movies: any[];
    isVertical?: boolean;
  }) {
    return (
      <div data-testid={`movies-carousel-${title.toLowerCase().replace(/ /g, '-')}`}>
        <h2>{title}</h2>
        <p>Movies: {movies.length}</p>
        <p>Vertical: {isVertical ? 'true' : 'false'}</p>
      </div>
    );
  };
});

describe('SearchPage', () => {
  const mockSearchedMovies = [
    {
      id: 1,
      title: 'Avengers',
      backdrop_path: '/avengers.jpg',
      poster_path: '/avengers-poster.jpg',
    },
    {
      id: 2,
      title: 'Iron Man',
      backdrop_path: '/ironman.jpg',
      poster_path: '/ironman-poster.jpg',
    },
  ];

  const mockPopularMovies = [
    {
      id: 3,
      title: 'Popular Movie 1',
      backdrop_path: '/popular1.jpg',
      poster_path: '/popular1-poster.jpg',
    },
    {
      id: 4,
      title: 'Popular Movie 2',
      backdrop_path: '/popular2.jpg',
      poster_path: '/popular2-poster.jpg',
    },
  ];

  beforeEach(() => {
    (getSearchedMovies as jest.Mock).mockResolvedValue(mockSearchedMovies);
    (getPopularMovies as jest.Mock).mockResolvedValue(mockPopularMovies);
    jest.clearAllMocks();
  });

  it('displays the search term in title', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    render(await SearchPage(props));

    expect(screen.getByText(/Results for avengers/i)).toBeInTheDocument();
  });

  it('calls getSearchedMovies with correct term', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    await SearchPage(props);

    expect(getSearchedMovies).toHaveBeenCalledWith('avengers');
    expect(getSearchedMovies).toHaveBeenCalledTimes(1);
  });

  it('calls getPopularMovies', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    await SearchPage(props);

    expect(getPopularMovies).toHaveBeenCalledTimes(1);
  });

  it('renders both Movies and You may also like carousels', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    render(await SearchPage(props));

    expect(screen.getByTestId('movies-carousel-movies')).toBeInTheDocument();
    expect(screen.getByTestId('movies-carousel-you-may-also-like')).toBeInTheDocument();
  });

  it('passes correct data to carousels', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    render(await SearchPage(props));

    // Check Movies carousel
    const moviesCarousel = screen.getByTestId('movies-carousel-movies');
    expect(moviesCarousel).toHaveTextContent('Movies: 2');
    expect(moviesCarousel).toHaveTextContent('Vertical: true');

    // Check popular carousel
    const popularCarousel = screen.getByTestId('movies-carousel-you-may-also-like');
    expect(popularCarousel).toHaveTextContent('Movies: 2');
    expect(popularCarousel).toHaveTextContent('Vertical: true');
  });

  it('calls notFound when term is empty', async () => {
    const props = {
      params: Promise.resolve({ term: '' }),
    };

    await expect(async () => {
      await SearchPage(props);
    }).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('does not call notFound when term is provided', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    render(await SearchPage(props));

    expect(notFound).not.toHaveBeenCalled();
  });

  it('handles URI encoded search terms', async () => {
    const props = {
      params: Promise.resolve({ term: 'iron%20man' }),
    };

    render(await SearchPage(props));

    expect(screen.getByText(/iron man/i)).toBeInTheDocument();
    expect(getSearchedMovies).toHaveBeenCalledWith('iron man');
  });

  it('renders with proper layout classes', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    const { container } = render(await SearchPage(props));

    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeInTheDocument();
  });
});

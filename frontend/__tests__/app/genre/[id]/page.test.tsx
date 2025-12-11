import { render, screen } from '@testing-library/react';
import GenrePage from '@/app/genre/[id]/page';
import { getDiscoverMovies } from '@/lib/getMovies';

// Mock the getMovies functions
jest.mock('@/lib/getMovies', () => ({
  getDiscoverMovies: jest.fn(),
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
      <div data-testid="movies-carousel">
        <h2>{title}</h2>
        <p>Movies: {movies.length}</p>
        <p>Vertical: {isVertical ? 'true' : 'false'}</p>
      </div>
    );
  };
});

describe('GenrePage', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      backdrop_path: '/test1.jpg',
      poster_path: '/poster1.jpg',
    },
    {
      id: 2,
      title: 'Test Movie 2',
      backdrop_path: '/test2.jpg',
      poster_path: '/poster2.jpg',
    },
  ];

  beforeEach(() => {
    (getDiscoverMovies as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays genre name from searchParams', async () => {
    const props = {
      params: { id: '28' },
      searchParams: { genre: 'Action' },
    };

    render(await GenrePage(props));

    expect(screen.getByText(/Results for Action/i)).toBeInTheDocument();
  });

  it('calls getDiscoverMovies with correct genre ID', async () => {
    const props = {
      params: { id: '28' },
      searchParams: { genre: 'Action' },
    };

    await GenrePage(props);

    expect(getDiscoverMovies).toHaveBeenCalledWith('28');
    expect(getDiscoverMovies).toHaveBeenCalledTimes(1);
  });

  it('renders MoviesCarousel with correct props', async () => {
    const props = {
      params: { id: '35' },
      searchParams: { genre: 'Comedy' },
    };

    render(await GenrePage(props));

    expect(screen.getByTestId('movies-carousel')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();
    expect(screen.getByText('Movies: 2')).toBeInTheDocument();
    expect(screen.getByText('Vertical: true')).toBeInTheDocument();
  });

  it('handles different genre values', async () => {
    const props = {
      params: { id: '35' },
      searchParams: { genre: 'Comedy' },
    };

    render(await GenrePage(props));

    expect(screen.getByText(/Results for Comedy/i)).toBeInTheDocument();
  });

  it('renders with proper layout classes', async () => {
    const props = {
      params: { id: '28' },
      searchParams: { genre: 'Action' },
    };

    const { container } = render(await GenrePage(props));

    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeInTheDocument();
  });
});

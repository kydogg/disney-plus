import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpComingMovies,
} from '@/lib/getMovies';

jest.mock('@/lib/getMovies', () => ({
  getPopularMovies: jest.fn(),
  getTopRatedMovies: jest.fn(),
  getUpComingMovies: jest.fn(),
}));

jest.mock('@/components/CarouselBannerWrapper', () => {
  return function MockCarouselBannerWrapper() {
    return <div data-testid="carousel-banner">Hero Banner</div>;
  };
});

jest.mock('@/components/MoviesCarousel', () => {
  return function MockMoviesCarousel({
    movies,
    title,
  }: {
    movies: any[];
    title: string;
  }) {
    return (
      <div data-testid={`movies-carousel-${title.toLowerCase()}`}>
        {title}: {movies.length} movies
      </div>
    );
  };
});

describe('Home Page', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      backdrop_path: '/test1.jpg',
      poster_path: '/poster1.jpg',
      overview: 'Test overview 1',
    },
    {
      id: 2,
      title: 'Test Movie 2',
      backdrop_path: '/test2.jpg',
      poster_path: '/poster2.jpg',
      overview: 'Test overview 2',
    },
  ];

  beforeEach(() => {
    (getUpComingMovies as jest.Mock).mockResolvedValue(mockMovies);
    (getTopRatedMovies as jest.Mock).mockResolvedValue(mockMovies);
    (getPopularMovies as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders main element', async () => {
    const component = await Home();
    render(component);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders CarouselBannerWrapper component', async () => {
    const component = await Home();
    render(component);

    expect(screen.getByTestId('carousel-banner')).toBeInTheDocument();
  });

  it('renders all three movie carousels', async () => {
    const component = await Home();
    render(component);

    expect(screen.getByTestId('movies-carousel-upcoming')).toBeInTheDocument();
    expect(
      screen.getByTestId('movies-carousel-top rated')
    ).toBeInTheDocument();
    expect(screen.getByTestId('movies-carousel-popular')).toBeInTheDocument();
  });

  it('displays correct carousel titles', async () => {
    const component = await Home();
    render(component);

    expect(screen.getByText(/Upcoming:/)).toBeInTheDocument();
    expect(screen.getByText(/Top Rated:/)).toBeInTheDocument();
    expect(screen.getByText(/Popular:/)).toBeInTheDocument();
  });

  it('fetches all movie data', async () => {
    await Home();

    expect(getUpComingMovies).toHaveBeenCalledTimes(1);
    expect(getTopRatedMovies).toHaveBeenCalledTimes(1);
    expect(getPopularMovies).toHaveBeenCalledTimes(1);
  });

  it('applies correct layout classes', async () => {
    const component = await Home();
    render(component);

    const carouselsContainer = document.querySelector('.flex.flex-col');
    expect(carouselsContainer).toBeInTheDocument();
    expect(carouselsContainer).toHaveClass('space-y-2', 'xl:-mt-48');
  });
});

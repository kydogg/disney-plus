import { render, screen } from '@testing-library/react';
import CarouselsBanner from '@/components/CarouselsBanner';
import { Movie } from '@/typings';

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn(), jest.fn()]),
}));

jest.mock('embla-carousel-autoplay', () => {
  const mockAutoplay = jest.fn(() => ({}));
  mockAutoplay.globalOptions = { delay: 8000 };
  return {
    __esModule: true,
    default: mockAutoplay,
  };
});

describe('CarouselsBanner', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      backdrop_path: '/test1.jpg',
      poster_path: '/poster1.jpg',
      overview: 'Test overview 1',
      adult: false,
      genre_ids: [28, 12],
      original_language: 'en',
      original_title: 'Test Movie 1',
      popularity: 100,
      release_date: '2023-01-01',
      video: false,
      vote_average: 8.5,
      vote_count: 1000,
    },
    {
      id: 2,
      title: 'Test Movie 2',
      backdrop_path: '/test2.jpg',
      poster_path: '/poster2.jpg',
      overview: 'Test overview 2',
      adult: false,
      genre_ids: [28, 12],
      original_language: 'en',
      original_title: 'Test Movie 2',
      popularity: 90,
      release_date: '2023-02-01',
      video: false,
      vote_average: 7.5,
      vote_count: 800,
    },
  ];

  it('renders carousel container', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    const carousel = document.querySelector('.overflow-hidden');
    expect(carousel).toBeInTheDocument();
  });

  it('renders all movie titles', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('renders all movie overviews', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    expect(screen.getByText('Test overview 1')).toBeInTheDocument();
    expect(screen.getByText('Test overview 2')).toBeInTheDocument();
  });

  it('renders correct number of movie slides', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    const slides = document.querySelectorAll('.flex-full');
    expect(slides).toHaveLength(2);
  });

  it('applies correct CSS classes for positioning', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    const carousel = document.querySelector('.overflow-hidden');
    expect(carousel).toHaveClass('lg:-mt-40', 'relative', 'cursor-pointer');
  });

  it('renders gradient overlay', () => {
    render(<CarouselsBanner movies={mockMovies} />);

    const gradient = document.querySelector('.bg-gradient-to-b');
    expect(gradient).toBeInTheDocument();
    expect(gradient).toHaveClass('absolute', 'inset-0');
  });
});

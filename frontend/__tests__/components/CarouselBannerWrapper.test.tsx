import { render, screen } from '@testing-library/react';
import CarouselBannerWrapper from '@/components/CarouselBannerWrapper';
import { getDiscoverMovies } from '@/lib/getMovies';

jest.mock('@/lib/getMovies', () => ({
  getDiscoverMovies: jest.fn(),
}));

jest.mock('@/components/CarouselsBanner', () => {
  return function MockCarouselsBanner({ movies }: { movies: any[] }) {
    return <div data-testid="carousels-banner">{movies.length} movies</div>;
  };
});

describe('CarouselBannerWrapper', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      backdrop_path: '/test1.jpg',
      overview: 'Test overview 1',
    },
    {
      id: 2,
      title: 'Test Movie 2',
      backdrop_path: '/test2.jpg',
      overview: 'Test overview 2',
    },
  ];

  beforeEach(() => {
    (getDiscoverMovies as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders CarouselsBanner with fetched movies', async () => {
    const component = await CarouselBannerWrapper({});
    render(component);

    expect(screen.getByTestId('carousels-banner')).toBeInTheDocument();
    expect(screen.getByText('2 movies')).toBeInTheDocument();
  });

  it('calls getDiscoverMovies with correct parameters', async () => {
    await CarouselBannerWrapper({ id: '28', keywords: 'action' });

    expect(getDiscoverMovies).toHaveBeenCalledWith('28', 'action');
  });

  it('calls getDiscoverMovies without parameters when none provided', async () => {
    await CarouselBannerWrapper({});

    expect(getDiscoverMovies).toHaveBeenCalledWith(undefined, undefined);
  });
});

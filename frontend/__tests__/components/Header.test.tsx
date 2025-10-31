import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// Mock child components
jest.mock('@/components/GenreDropdown', () => {
  return function MockGenreDropdown() {
    return <div data-testid="genre-dropdown">Genre Dropdown</div>;
  };
});

jest.mock('@/components/SearchInput', () => {
  return function MockSearchInput() {
    return <div data-testid="search-input">Search Input</div>;
  };
});

jest.mock('@/components/ThemeToggler', () => {
  return {
    ThemeToggler: function MockThemeToggler() {
      return <div data-testid="theme-toggler">Theme Toggler</div>;
    },
  };
});

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header', () => {
  it('renders the header element', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders the Disney logo', () => {
    render(<Header />);

    const logo = screen.getByAltText('');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://links.papareact.com/a943ae');
  });

  it('logo links to /home', () => {
    render(<Header />);

    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/home');
  });

  it('renders GenreDropdown component', () => {
    render(<Header />);

    const genreDropdown = screen.getByTestId('genre-dropdown');
    expect(genreDropdown).toBeInTheDocument();
  });

  it('renders SearchInput component', () => {
    render(<Header />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders ThemeToggler component', () => {
    render(<Header />);

    const themeToggler = screen.getByTestId('theme-toggler');
    expect(themeToggler).toBeInTheDocument();
  });

  it('applies correct CSS classes to header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'w-full', 'z-20', 'top-0');
  });

  it('applies gradient background to header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-gradient-to-t');
  });

  it('logo has correct dimensions', () => {
    render(<Header />);

    const logo = screen.getByAltText('');
    expect(logo).toHaveAttribute('width', '120');
    expect(logo).toHaveAttribute('height', '100');
  });

  it('logo has dark mode invert class', () => {
    render(<Header />);

    const logo = screen.getByAltText('');
    expect(logo).toHaveClass('invert-0', 'dark:invert');
  });
});

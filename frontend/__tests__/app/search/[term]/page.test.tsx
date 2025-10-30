import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SearchPage from '@/app/search/[term]/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the search term', () => {
    const props = {
      params: { term: 'avengers' },
    };

    render(<SearchPage {...props} />);

    expect(screen.getByText(/welcome to the search page: avengers/i)).toBeInTheDocument();
  });

  it('calls notFound when term is empty', () => {
    const props = {
      params: { term: '' },
    };

    render(<SearchPage {...props} />);

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('does not call notFound when term is provided', () => {
    const props = {
      params: { term: 'avengers' },
    };

    render(<SearchPage {...props} />);

    expect(notFound).not.toHaveBeenCalled();
  });

  it('handles URI encoded search terms', () => {
    const props = {
      params: { term: 'iron%20man' },
    };

    render(<SearchPage {...props} />);

    expect(screen.getByText(/iron%20man/i)).toBeInTheDocument();
  });
});

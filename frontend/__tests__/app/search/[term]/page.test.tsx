import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SearchPage from '@/app/search/[term]/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the search term', async () => {
    const props = {
      params: Promise.resolve({ term: 'avengers' }),
    };

    render(await SearchPage(props));

    expect(screen.getByText(/welcome to the search page: avengers/i)).toBeInTheDocument();
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
  });
});

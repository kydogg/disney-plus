import { render, screen, waitFor } from '@testing-library/react';
import GenrePage from '@/app/genre/[id]/page';

describe('GenrePage', () => {
  it('displays genre ID from params', async () => {
    const props = {
      params: Promise.resolve({ id: '28' }),
      searchParams: Promise.resolve({ genre: 'Action' }),
    };

    render(await GenrePage(props));

    expect(screen.getByText(/ID: 28/i)).toBeInTheDocument();
  });

  it('displays genre name from searchParams', async () => {
    const props = {
      params: Promise.resolve({ id: '28' }),
      searchParams: Promise.resolve({ genre: 'Action' }),
    };

    render(await GenrePage(props));

    expect(screen.getByText(/name: Action/i)).toBeInTheDocument();
  });

  it('handles different genre values', async () => {
    const props = {
      params: Promise.resolve({ id: '35' }),
      searchParams: Promise.resolve({ genre: 'Comedy' }),
    };

    render(await GenrePage(props));

    expect(screen.getByText(/ID: 35/i)).toBeInTheDocument();
    expect(screen.getByText(/name: Comedy/i)).toBeInTheDocument();
  });
});

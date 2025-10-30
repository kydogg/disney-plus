import { render, screen } from '@testing-library/react';
import GenrePage from '@/app/genre/[id]/page';

describe('GenrePage', () => {
  it('displays genre ID from params', () => {
    const props = {
      params: { id: '28' },
      searchParams: { genre: 'Action' },
    };

    render(<GenrePage {...props} />);

    expect(screen.getByText(/ID: 28/i)).toBeInTheDocument();
  });

  it('displays genre name from searchParams', () => {
    const props = {
      params: { id: '28' },
      searchParams: { genre: 'Action' },
    };

    render(<GenrePage {...props} />);

    expect(screen.getByText(/name: Action/i)).toBeInTheDocument();
  });

  it('handles different genre values', () => {
    const props = {
      params: { id: '35' },
      searchParams: { genre: 'Comedy' },
    };

    render(<GenrePage {...props} />);

    expect(screen.getByText(/ID: 35/i)).toBeInTheDocument();
    expect(screen.getByText(/name: Comedy/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { name: /lets build disney/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders main element', () => {
    render(<Home />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});

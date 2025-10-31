import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders main element', () => {
    render(<Home />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('main element is empty', () => {
    render(<Home />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeEmptyDOMElement();
  });
});

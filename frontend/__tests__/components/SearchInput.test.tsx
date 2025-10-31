import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SearchInput', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders search input field', () => {
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    expect(input).toBeInTheDocument();
  });

  it('allows user to type in the input', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'avengers');

    expect(input).toHaveValue('avengers');
  });

  it('navigates to search page on form submit', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'spiderman');
    await user.type(input, '{Enter}');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search/spiderman');
    });
  });

  it('resets form after submission', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'ironman');
    await user.type(input, '{Enter}');

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('validates minimum length (2 characters)', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'a');
    await user.type(input, '{Enter}');

    // Should not navigate with invalid input
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('validates maximum length (50 characters)', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    const longString = 'a'.repeat(51);
    await user.type(input, longString);
    await user.type(input, '{Enter}');

    // Should not navigate with invalid input
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('accepts valid search terms', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'ab'); // Minimum valid length
    await user.type(input, '{Enter}');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search/ab');
    });
  });

  it('handles search terms with spaces', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText(/search\.\.\./i);
    await user.type(input, 'iron man');
    await user.type(input, '{Enter}');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search/iron man');
    });
  });
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders expected body text', () => {
  render(<App />);
  const linkElement = screen.getByText(/BrightSign React Web App Example/i);
  expect(linkElement).toBeInTheDocument();
});

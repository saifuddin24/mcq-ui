import { render, screen } from '@testing-library/react';
import App_2 from './App_2';

test('renders learn react link', () => {
  render(<App_2 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

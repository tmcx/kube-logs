import React from 'react';
import { render, screen } from '@testing-library/react';
import PodsTable from './pods-table';

test('renders learn react link', () => {
  render(<PodsTable />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

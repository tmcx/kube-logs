import React from 'react';
import { render, screen } from '@testing-library/react';
import PodLogs from './pod-logs';

test('renders learn react link', () => {
  render(<PodLogs />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

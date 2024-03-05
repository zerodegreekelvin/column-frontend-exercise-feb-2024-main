import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Searchbar from './Searchbar';

describe('Searchbar Component', () => {
  test('test to change to date', () => {
    const { rerender } = render(<Searchbar searchMethod="title" />);
    expect(screen.getByTestId('searchTitle')).toBeInTheDocument();

    rerender(<Searchbar searchMethod="date" />);
    expect(screen.getByTestId('startDate')).toBeInTheDocument();
    expect(screen.getByTestId('endDate')).toBeInTheDocument();
  });
});
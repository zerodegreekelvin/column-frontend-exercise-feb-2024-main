import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import * as firebase from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
}));
jest.mock('./db', () => ({
  db: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and pagination buttons', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument();
    expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  test('displays loading spinner', () => {
    render(<App />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('displays error message', async () => {
    const errorMessage = 'Error fetching notices';
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(firebase, 'getDocs').mockRejectedValue(new Error(errorMessage));

    render(<App />);
  
    await waitFor(() => {
      expect(screen.getByText(`There has been an error please try again later`)).toBeInTheDocument();
    });
  });

  test('fetches notices data with empty searchTerm and currentPage 1', async () => {
    const notices = [
      { id: '1', title: 'Notice 1', publicationDate: new Date() },
      { id: '2', title: 'Notice 2', publicationDate: new Date() },
      { id: '3', title: 'Notice 3', publicationDate: new Date() },
    ];
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(firebase, 'getDocs').mockResolvedValue({ docs: notices.map(notice => ({ id: notice.id, data: () => notice })) });
  
    render(<App />);
  
    await waitFor(() => {
      expect(screen.getByText('Notice 1')).toBeInTheDocument();
      expect(screen.getByText('Notice 2')).toBeInTheDocument();
      expect(screen.getByText('Notice 3')).toBeInTheDocument();
    });
  });

  test('fetches notices data with non-empty searchTerm and currentPage greater than 1', async () => {
    const notices = [
      { id: '4', title: 'Notice 4', publicationDate: new Date() },
      { id: '5', title: 'Notice 5', publicationDate: new Date() },
      { id: '6', title: 'Notice 6', publicationDate: new Date() },
    ];
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(firebase, 'getDocs').mockResolvedValue({ docs: notices.map(notice => ({ id: notice.id, data: () => notice })) });
  
    render(<App />);
  
    fireEvent.change(screen.getByPlaceholderText('Search by title...'), { target: { value: 'Notice' } });
    fireEvent.click(screen.getByTestId('next-button'));
  
    await waitFor(() => {
      expect(screen.getByText('Notice 4')).toBeInTheDocument();
      expect(screen.getByText('Notice 5')).toBeInTheDocument();
      expect(screen.getByText('Notice 6')).toBeInTheDocument();
    });
  });
});

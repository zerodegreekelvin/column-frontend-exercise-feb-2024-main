import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { addDoc } from 'firebase/firestore';

jest.mock('firebase/firestore');

describe('Sidebar', () => {
  it('test_handleFormSubmit_addsDocument', async () => {
    const mockAddDoc = addDoc.mockResolvedValue({ id: 'abc123' });
    render(<Sidebar isAddingNewNotice={() => {}} />);
    
    fireEvent.change(screen.getByTestId('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByTestId('Content'), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByTestId('Date'), { target: { value: '2023-04-01' } });
    fireEvent.click(screen.getByText('Add Notice'));

    await waitFor(() => expect(mockAddDoc).toHaveBeenCalled());
  });

  it('test_handleFormSubmit_handlesErrors', async () => {
    const mockAddDoc = addDoc.mockRejectedValue(new Error('Failed to add document'));
    render(<Sidebar isAddingNewNotice={() => {}} />);
    
    fireEvent.change(screen.getByTestId('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByTestId('Content'), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByTestId('Date'), { target: { value: '2023-04-01' } });
    fireEvent.click(screen.getByText('Add Notice'));

    await waitFor(() => expect(mockAddDoc).toHaveBeenCalled());
    // Here you would also check for some error handling behavior, like displaying an error message
  });

  it('test_handleFormSubmit_resetsStateAfterAddingDocument', async () => {
    addDoc.mockResolvedValue({ id: 'abc123' });
    render(<Sidebar isAddingNewNotice={() => {}} />);
    
    fireEvent.change(screen.getByTestId('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByTestId('Content'), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByTestId('Date'), { target: { value: '2023-04-01' } });
    fireEvent.click(screen.getByText('Add Notice'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Title').value).toBe('');
      expect(screen.queryByPlaceholderText('Content').value).toBe('');
    });
  });
});
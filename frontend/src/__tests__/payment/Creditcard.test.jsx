// CreditCardForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreditCardForm, { 
  formatCreditCardNumber, 
  formatCVC, 
  formatExpirationDate 
} from '../../components/payment/CreditCardForm';

// Mock the Cards component from react-credit-cards-2
jest.mock('react-credit-cards-2', () => {
  return function MockCards(props) {
    return (
      <div data-testid="credit-card">
        <span data-testid="cc-number">{props.number}</span>
        <span data-testid="cc-name">{props.name}</span>
        <span data-testid="cc-expiry">{props.expiry}</span>
        <span data-testid="cc-cvc">{props.cvc}</span>
        <span data-testid="cc-focused">{props.focused}</span>
        <span data-testid="cc-issuer">{props.issuer}</span>
      </div>
    );
  };
});

describe('CreditCardForm Utility Functions', () => {
  test('formatCreditCardNumber formats card number correctly', () => {
    expect(formatCreditCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    expect(formatCreditCardNumber('411111')).toBe('4111 11');
    expect(formatCreditCardNumber('')).toBe('');
    expect(formatCreditCardNumber('41111111111111112222')).toBe('4111 1111 1111 1111'); // Should limit to 16 digits
    expect(formatCreditCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111'); // Should remove non-digits
  });

  test('formatCVC formats CVC correctly', () => {
    expect(formatCVC('123')).toBe('123');
    expect(formatCVC('1234')).toBe('123'); // Should limit to 3 digits
    expect(formatCVC('')).toBe('');
    expect(formatCVC('12a')).toBe('12'); // Should remove non-digits
  });

  test('formatExpirationDate formats expiry date correctly', () => {
    expect(formatExpirationDate('1224')).toBe('12/24');
    expect(formatExpirationDate('12')).toBe('12');
    expect(formatExpirationDate('')).toBe('');
    expect(formatExpirationDate('12/24')).toBe('12/24'); // Should handle already formatted input
  });
});

describe('CreditCardForm Component', () => {
  test('renders with default card type', () => {
    render(<CreditCardForm card="visa" />);
    
    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
    expect(screen.getByTestId('cc-issuer')).toHaveTextContent('visa');
  });

  test('updates state when card prop changes', () => {
    const { rerender } = render(<CreditCardForm card="visa" />);
    
    expect(screen.getByTestId('cc-issuer')).toHaveTextContent('visa');
    
    rerender(<CreditCardForm card="mastercard" />);
    
    expect(screen.getByTestId('cc-issuer')).toHaveTextContent('mastercard');
  });

  test('handles input changes and formats values', () => {
    render(<CreditCardForm card="visa" />);
    
    // Test card number input
    const numberInput = screen.getByPlaceholderText('Card Number');
    fireEvent.change(numberInput, { target: { name: 'number', value: '4111111111111111' } });
    expect(screen.getByTestId('cc-number')).toHaveTextContent('4111 1111 1111 1111');
    
    // Test name input
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
    expect(screen.getByTestId('cc-name')).toHaveTextContent('John Doe');
    
    // Test expiry input
    const expiryInput = screen.getByPlaceholderText('Valid Thru');
    fireEvent.change(expiryInput, { target: { name: 'expiry', value: '1224' } });
    expect(screen.getByTestId('cc-expiry')).toHaveTextContent('12/24');
    
    // Test CVC input
    const cvcInput = screen.getByPlaceholderText('CVC');
    fireEvent.change(cvcInput, { target: { name: 'cvc', value: '123' } });
    expect(screen.getByTestId('cc-cvc')).toHaveTextContent('123');
  });

  test('handles input focus', () => {
    render(<CreditCardForm card="visa" />);
    
    const numberInput = screen.getByPlaceholderText('Card Number');
    fireEvent.focus(numberInput);
    expect(screen.getByTestId('cc-focused')).toHaveTextContent('number');
    
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.focus(nameInput);
    expect(screen.getByTestId('cc-focused')).toHaveTextContent('name');
  });

  test('prevents form submission default behavior', () => {
    render(<CreditCardForm card="visa" />);
    
    // Mock console.log to verify form submission
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Find and submit the form
    const form = screen.getByPlaceholderText('Card Number').closest('form');
    fireEvent.submit(form);
    
    // Check that default behavior was prevented and our callback was executed
    expect(consoleSpy).toHaveBeenCalledWith(
      'Form submitted with the following data:',
      expect.any(Object)
    );
    
    consoleSpy.mockRestore();
  });
});
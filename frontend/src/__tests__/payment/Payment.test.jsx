// src/__tests__/PaymentPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentPage from '../../pages/PaymentPage';

// Mock the child components
jest.mock('../../components/payment/PaymentMethods', () => {
  return function MockPaymentMethods(props) {
    return (
      <div data-testid="payment-methods">
        {props.paymentmethods.map((method, index) => (
          <button 
            key={index} 
            data-testid={`method-${method.name}`}
            onClick={() => props.onMethodClick(method.name)}
          >
            {method.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/payment/PaymentInfo', () => {
  return function MockPaymentInfo(props) {
    return (
      <div data-testid="payment-info">
        <select 
          data-testid="method-select"
          value={props.selectedMethod}
          onChange={props.onMethodChange}
        >
          <option value="visa">Visa</option>
          <option value="mastercard">Master Card</option>
          <option value="maestro">Maestro</option>
          <option value="unionpay">Union Pay</option>
        </select>
        <span data-testid="selected-method">{props.selectedMethod}</span>
        <span data-testid="selected-card">{props.selectedCard}</span>
      </div>
    );
  };
});

// Mock Header and Footer
jest.mock('../../pages/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../pages/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('PaymentPage Component', () => {
  test('renders payment page with default visa method selected', () => {
    render(<PaymentPage />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('payment-methods')).toBeInTheDocument();
    expect(screen.getByTestId('payment-info')).toBeInTheDocument();
  });
});
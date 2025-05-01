// PaymentMethods.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentMethods from '../../components/payment/PaymentMethods';

describe('PaymentMethods Component', () => {
  const mockPaymentMethods = [
    {
      name: "visa",
      image: "visa-image-url",
    },
    {
      name: "mastercard",
      image: "mastercard-image-url",
    },
    {
      name: "maestro",
      image: "maestro-image-url",
    },
    {
      name: "unionpay",
      image: "unionpay-image-url",
    }
  ];
  
  const mockOnMethodClick = jest.fn();

  test('renders payment methods with correct count', () => {
    render(
      <PaymentMethods 
        paymentmethods={mockPaymentMethods} 
        onMethodClick={mockOnMethodClick} 
      />
    );
    
    expect(screen.getByText(/we accept the follwoing secure payment methods/i)).toBeInTheDocument();
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
  });

  test('calls onMethodClick with correct method name when image is clicked', () => {
    render(
      <PaymentMethods 
        paymentmethods={mockPaymentMethods} 
        onMethodClick={mockOnMethodClick} 
      />
    );
    
    const visaImage = screen.getByAltText('visa');
    fireEvent.click(visaImage);
    expect(mockOnMethodClick).toHaveBeenCalledWith('visa');
    
    const mastercardImage = screen.getByAltText('mastercard');
    fireEvent.click(mastercardImage);
    expect(mockOnMethodClick).toHaveBeenCalledWith('mastercard');
  });
});
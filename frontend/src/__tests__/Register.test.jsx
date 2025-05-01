import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../pages/Register';
import { act } from 'react-dom/test-utils';

// Mock the Header and Footer components
jest.mock('../pages/Header', () => () => <div data-testid="header-mock">Header</div>);
jest.mock('../pages/Footer', () => () => <div data-testid="footer-mock">Footer</div>);

// Mock the React icons
jest.mock('react-icons/fa', () => ({
  FaEnvelope: () => <span data-testid="envelope-icon">Envelope Icon</span>,
  FaUser: () => <span data-testid="user-icon">User Icon</span>,
  FaKey: () => <span data-testid="key-icon">Key Icon</span>,
}));

describe('Register Component', () => {
  // Original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
    
    // Mock window.location
    delete window.location;
    window.location = {
      href: 'http://localhost/',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    window.location = originalLocation;
  });

  it('renders register form correctly', () => {
    render(<Register />);
    
    // Check if form elements exist
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/retype password/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    render(<Register />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPassInput = screen.getByLabelText(/retype password/i);
    const userTypeSelect = screen.getByRole('combobox');

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassInput, { target: { value: 'password123' } });
    fireEvent.change(userTypeSelect, { target: { value: 'User' } });

    expect(emailInput.value).toBe('test@gmail.com');
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPassInput.value).toBe('password123');
    expect(userTypeSelect.value).toBe('User');
  });

  it('displays error when email is invalid', async () => {
    render(<Register />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPassInput = screen.getByLabelText(/retype password/i);
    const userTypeSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /next/i });

    fireEvent.change(emailInput, { target: { value: 'test@invalid.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassInput, { target: { value: 'password123' } });
    fireEvent.change(userTypeSelect, { target: { value: 'User' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email must end with gmail.com, yahoo.com, or hotmail.com./i)).toBeInTheDocument();
    });
  });

  it('displays error when passwords do not match', async () => {
    render(<Register />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPassInput = screen.getByLabelText(/retype password/i);
    const userTypeSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /next/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassInput, { target: { value: 'password456' } });
    fireEvent.change(userTypeSelect, { target: { value: 'User' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
    });
  });

  it('submits form data when all validations pass', async () => {
    // Mock fetch to return successful response
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(<Register />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPassInput = screen.getByLabelText(/retype password/i);
    const userTypeSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /next/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassInput, { target: { value: 'password123' } });
    fireEvent.change(userTypeSelect, { target: { value: 'User' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: 'test@gmail.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password123',
        userrole: 'User',
      }),
    });

    // Instead of directly checking window.location.href, use a spy to verify the assignment attempt
    expect(window.location.href).toBe("http://localhost:5000/register2");
  });

  it('displays error message on failed API response', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ errorMessage: "User already exists" }),
      })
    );

    render(<Register />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPassInput = screen.getByLabelText(/retype password/i);
    const userTypeSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /next/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPassInput, { target: { value: 'password123' } });
    fireEvent.change(userTypeSelect, { target: { value: 'User' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock the react-router-dom useNavigate hook
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the toast functionality
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock Header and Footer components
jest.mock('../pages/Header', () => function MockHeader() {
  return <div data-testid="mock-header">Header Component</div>;
});

jest.mock('../pages/Footer', () => function MockFooter() {
  return <div data-testid="mock-footer">Footer Component</div>;
});

// Mock CSS imports
jest.mock('./Login.css', () => ({}), { virtual: true });
jest.mock('react-toastify/dist/ReactToastify.css', () => ({}), { virtual: true });

// Helper function to render with router context
const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders the login form correctly', () => {
    renderWithRouter(<Login />);
    
    // Check that the component renders with the correct elements
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByText('P2P')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Show Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    renderWithRouter(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    // Simulate user typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check that the input values have been updated
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('toggles password visibility when checkbox is clicked', () => {
    renderWithRouter(<Login />);
    
    const passwordInput = screen.getByLabelText('Password');
    const showPasswordCheckbox = screen.getByRole('checkbox');
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Toggle back
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });


    // it('submits the form with correct credentials and handles successful login', async () => {
    //   // Mocking the global fetch to simulate a successful login
    //   global.fetch.mockResolvedValueOnce({
    //     ok: true,
    //     json: async () => ({ username: 'testuser' }), // Mock response to include username
    //   });
  
    //   // Mock the navigate function
    //   const mockedNavigate = useNavigate();
  
    //   renderWithRouter(<Login />);
  
    //   const usernameInput = screen.getByLabelText('Username');
    //   const passwordInput = screen.getByLabelText('Password');
    //   const loginButton = screen.getByRole('button', { name: 'Login' });
  
    //   // Fill in form and submit
    //   fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
    //   fireEvent.click(loginButton);
  
    //   // Verify fetch was called with correct arguments
    //   await waitFor(() => {
    //     expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       credentials: 'include',
    //       body: JSON.stringify({
    //         username: 'testuser',
    //         password: 'password123',
    //       }),
    //     });
    //   });
  
    //   // Verify toast.success was called and navigation occurred
    //   await waitFor(() => {
    //     expect(toast.success).toHaveBeenCalledWith('Login successful!');
    //     expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    //   });
    // });


  it('handles login failure appropriately', async () => {
    // Mock failed API response
    const errorMessage = 'Invalid credentials';
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errorMessage })
    });
    
    renderWithRouter(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    // Fill in form and submit
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    // Verify toast.error was called with error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles network error during login', async () => {
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    renderWithRouter(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    // Fill in form and submit
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Verify toast.error was called with general error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error');
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  it('checks that links navigate to the correct pages', () => {
    renderWithRouter(<Login />);
    
    const forgotPasswordLink = screen.getByText('Forgot Password?');
    const registerLink = screen.getByText('Register');
    
    // Check href attributes
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
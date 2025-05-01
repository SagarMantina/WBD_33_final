import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GamePage from '../pages/GamePage';

// Mock the components
jest.mock('../components/gamepage/ImageContainer', () => ({
  __esModule: true,
  default: ({ game_details, currentImage, handleMouseEnter, handleMouseLeave }) => (
    <div data-testid="image-container">
      <img src={currentImage} alt="Current" data-testid="current-image" />
      <div data-testid="thumbnail" onMouseEnter={() => handleMouseEnter('thumbnail-image')} onMouseLeave={handleMouseLeave}>Thumbnail</div>
    </div>
  )
}));

jest.mock('../components/gamepage/InfoContainer', () => ({
  __esModule: true,
  default: ({ game_details }) => (
    <div data-testid="info-container">
      <p>Price: {game_details.price}</p>
    </div>
  )
}));

jest.mock('../components/gamepage/About', () => ({
  __esModule: true,
  default: ({ game_details }) => (
    <div data-testid="about-section">
      <p>{game_details.description}</p>
    </div>
  )
}));

jest.mock('../components/gamepage/CartPurchase', () => ({
  __esModule: true,
  default: ({ game_name, game_price, game_image, setPopUp }) => (
    <div data-testid="cart-purchase">
      <button onClick={() => setPopUp(true)}>Buy {game_name} for ${game_price}</button>
    </div>
  )
}));

jest.mock('../components/gamepage/Reviews', () => ({
  __esModule: true,
  default: ({ reviews, curr_rating }) => (
    <div data-testid="reviews-section">
      <p>Rating: {curr_rating}</p>
      <p>Reviews: {reviews ? reviews.length : 0}</p>
    </div>
  )
}));

jest.mock('../components/gamepage/CompareGames', () => ({
  __esModule: true,
  default: ({ games }) => (
    <div data-testid="compare-games">
      <p>Compare Games: {games.length}</p>
    </div>
  )
}));

jest.mock('../components/gamepage/popUp', () => ({
  __esModule: true,
  default: ({ game_name, game_price, game_image, onClose }) => (
    <div data-testid="popup-component">
      <h3>{game_name}</h3>
      <p>${game_price}</p>
      <button onClick={onClose} data-testid="close-popup">Close</button>
    </div>
  )
}));

jest.mock('../components/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>
}));

jest.mock('../pages/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

jest.mock('../pages/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>
}));

// Mock AOS
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn()
}));

// Mock fetch function
global.fetch = jest.fn();

describe('GamePage Component', () => {
  const mockGameDetails = {
    game_name: 'Test Game',
    price: 59.99,
    description: 'This is a test game',
    main_image: 'main_image_url',
    screenshots: ['screenshot1_url', 'screenshot2_url'],
    rating: 4.5,
    reviews: [
      { id: 1, content: 'Great game', rating: 5 },
      { id: 2, content: 'Good game', rating: 4 }
    ]
  };

  const mockCompareGames = [
    { id: 1, name: 'Compare Game 1' },
    { id: 2, name: 'Compare Game 2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch responses
    global.fetch.mockImplementation((url) => {
      if (url.includes('/clickgame/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGameDetails)
        });
      } else if (url.includes('/comparisons/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCompareGames)
        });
      } else if (url.includes('/userdata')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: 'User' })
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderWithRouter = (gamename = 'testgame') => {
    return render(
      <MemoryRouter initialEntries={[`/game/${gamename}`]}>
        <Routes>
          <Route path="/game/:gamename" element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading screen initially', () => {
    renderWithRouter();
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('renders game details after loading', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByTestId('image-container')).toBeInTheDocument();
    expect(screen.getByTestId('info-container')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-section')).toBeInTheDocument();
    expect(screen.getByTestId('compare-games')).toBeInTheDocument();
  });

  test('shows CartPurchase component for User role', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('cart-purchase')).toBeInTheDocument();
  });

  test('does not show CartPurchase component for non-User role', async () => {
    // Mock userdata fetch to return non-User role
    global.fetch.mockImplementation((url) => {
      if (url.includes('/userdata')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: 'Seller' })
        });
      } else if (url.includes('/clickgame/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGameDetails)
        });
      } else if (url.includes('/comparisons/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCompareGames)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId('cart-purchase')).not.toBeInTheDocument();
  });

  test('handles image hover events', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    const thumbnail = screen.getByTestId('thumbnail');
    
    // Test mouseEnter
    fireEvent.mouseEnter(thumbnail);
    expect(screen.getByTestId('current-image')).toHaveAttribute('src', 'thumbnail-image');
    
    // Test mouseLeave
    fireEvent.mouseLeave(thumbnail);
    expect(screen.getByTestId('current-image')).toHaveAttribute('src', 'main_image_url');
  });

  test('opens and closes popup', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    // Open popup
    const buyButton = screen.getByText(/Buy Test Game for \$59.99/i);
    fireEvent.click(buyButton);
    
    expect(screen.getByTestId('popup-component')).toBeInTheDocument();
    expect(document.body.classList.contains('popup-open')).toBe(true);
    
    // Close popup
    const closeButton = screen.getByTestId('close-popup');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('popup-component')).not.toBeInTheDocument();
    });
    expect(document.body.classList.contains('popup-open')).toBe(false);
  });

  test('handles API error state', async () => {
    // Mock fetch to simulate error
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404
      });
    });

    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
  });

  test('handles network error', async () => {
    // Mock fetch to simulate network error
    global.fetch.mockImplementation(() => {
      return Promise.reject(new Error('Network error'));
    });

    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
  });

  test('cleans up body class on unmount when popup is open', async () => {
    const { unmount } = renderWithRouter();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    });

    // Open popup
    const buyButton = screen.getByText(/Buy Test Game for \$59.99/i);
    fireEvent.click(buyButton);
    
    expect(document.body.classList.contains('popup-open')).toBe(true);
    
    // Unmount component
    unmount();
    
    expect(document.body.classList.contains('popup-open')).toBe(false);
  });
});
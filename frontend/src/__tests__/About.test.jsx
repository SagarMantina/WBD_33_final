import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../pages/About';

// Mock the components that About depends on, now from pages folder
jest.mock('../pages/Header', () => function MockHeader() {
  return <div data-testid="mock-header">Header Component</div>;
});

jest.mock('../pages/Footer', () => function MockFooter() {
  return <div data-testid="mock-footer">Footer Component</div>;
});

// Mock the CSS module
jest.mock('../src/styles/About.module.css', () => ({
  'aboutpage': 'aboutpage',
  'firstpart': 'firstpart',
  'firstpartcontent': 'firstpartcontent',
  'firstpartvideo': 'firstpartvideo',
  'myvideo': 'myvideo',
  'secondpart': 'secondpart',
  'secondpartcontent': 'secondpartcontent',
  'believes': 'believes',
  'thirdpart': 'thirdpart',
  'games_col': 'games_col',
  'game_image': 'game_image',
  'visible': 'visible',
  'thirdpartcontent': 'thirdpartcontent',
}));

describe('About Component', () => {
  beforeEach(() => {
    // Mock window.HTMLMediaElement.prototype methods which aren't implemented in JSDOM
    Object.defineProperty(window.HTMLMediaElement.prototype, 'muted', {
      set: jest.fn(),
      get: jest.fn(() => false),
    });
    
    // Mock media elements
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
    window.HTMLMediaElement.prototype.load = jest.fn();
  });

  it('renders the About component successfully', () => {
    // Use a try-catch to get more detailed error information if the render fails
    try {
      render(<About />);
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    } catch (error) {
      console.error('Error rendering About component:', error);
      throw error;
    }
  });

  it('displays the company name and tagline', () => {
    render(<About />);
    expect(screen.getByText(/PAY TO PLAY/)).toBeInTheDocument();
    expect(screen.getByText(/Your premier hub for all things gaming/)).toBeInTheDocument();
  });

  it('shows the "what we believe in" section', () => {
    render(<About />);
    expect(screen.getByText('what we believe in')).toBeInTheDocument();
    
    // Check if the beliefs list items are rendered
    const beliefItems = screen.getAllByRole('listitem');
    expect(beliefItems.length).toBe(4);
    expect(beliefItems[0]).toHaveTextContent(/Highlight the sense of community/);
  });

  it('renders the "Access Games Instantly" section', () => {
    render(<About />);
    expect(screen.getByText('Access Games Instantly')).toBeInTheDocument();
    expect(screen.getByText(/With hundreds of games from AAA to indie/)).toBeInTheDocument();
    
    const storeLink = screen.getByText(/Browse the Store/);
    expect(storeLink).toBeInTheDocument();
    expect(storeLink.tagName.toLowerCase()).toBe('a');
    expect(storeLink).toHaveAttribute('href', '/');
  });

  it('renders game images', () => {
    render(<About />);
    
    // Check if images are rendered
    const gameImages = screen.getAllByRole('img');
    
    // Just verify we have some images
    expect(gameImages.length).toBeGreaterThan(0);
  });

  it('renders the video element', () => {
    render(<About />);
    const videoElements = document.querySelectorAll('video');
    expect(videoElements.length).toBeGreaterThan(0);
    
    if (videoElements.length > 0) {
      const videoElement = videoElements[0];
      expect(videoElement).toHaveAttribute('autoplay');
      expect(videoElement).toHaveAttribute('loop');
    }
  });
});
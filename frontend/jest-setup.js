// jest-setup.js
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
    global.TextDecoder = require('util').TextDecoder;
}

import '@testing-library/jest-dom';

// Mock HTML media element
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();
Object.defineProperty(window.HTMLMediaElement.prototype, 'muted', {
    set: jest.fn(),
    get: jest.fn(() => false),
});
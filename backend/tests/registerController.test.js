const { postregister } = require('../controllers/registerController');
const bcrypt = require('bcryptjs');
const user = require('../models/accountschema');

jest.mock('bcryptjs');
jest.mock('../models/accountschema');

describe('Register Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('postregister', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password123',
        userrole: 'user',
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null); // Ensure email and username checks return null
      user.countDocuments.mockResolvedValue(1);
      user.prototype.save = jest.fn();

      await postregister(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(user.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(user.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful!' });
    });

    it('should assign admin role if no users exist', async () => {
      req.body = {
        email: 'admin@example.com',
        username: 'adminuser',
        password: 'adminpass',
        confirm_pass: 'adminpass',
        userrole: 'admin',
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null); // Ensure email and username checks return null
      user.countDocuments.mockResolvedValue(0);
      user.prototype.save = jest.fn();

      await postregister(req, res);

      expect(req.body.userrole).toBe('admin');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful!' });
    });

    it('should return 401 if passwords do not match', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password456',
      };

      await postregister(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Please Enter same Password' });
    });

    it('should return 401 if username already exists', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password123',
      };

      user.findOne.mockResolvedValueOnce({ username: 'testuser' }).mockResolvedValueOnce(null); // Mock username check to return a user
      await postregister(req, res);

      expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Username already exists' });
    });

    it('should return 401 if email already exists', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password123',
      };

      user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ email: 'test@example.com' }); // Mock email check to return a user
      await postregister(req, res);

      expect(user.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Email already exists' });
    });

    it('should handle internal server errors', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirm_pass: 'password123',
      };

      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await postregister(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
  });
});

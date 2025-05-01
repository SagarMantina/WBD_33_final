
const { postlogin } = require('../controllers/loginController'); 
const user = require('../models/accountschema');
const bcrypt = require('bcryptjs');

jest.mock('../models/accountschema');
jest.mock('bcryptjs');

describe('Login Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should login successfully and set cookie if credentials are correct', async () => {
    req.body = { username: 'testuser', password: 'password123' };
    const mockUser = { username: 'testuser', password: 'hashedpass', role: 'admin' };

    user.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    await postlogin(req, res);

    expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpass');
    expect(res.cookie).toHaveBeenCalledWith('username', 'testuser', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ userrole: 'admin' });
  });

  it('should return 401 if username does not exist', async () => {
    req.body = { username: 'nonexistent', password: 'irrelevant' };

    user.findOne.mockResolvedValue(null);

    await postlogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ errorMessage: "Username not found" });
  });

  it('should return 401 if password is incorrect', async () => {
    req.body = { username: 'testuser', password: 'wrongpass' };
    const mockUser = { username: 'testuser', password: 'hashedpass' };

    user.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await postlogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ errorMessage: "Incorrect password" });
  });

  it('should handle internal server error', async () => {
    req.body = { username: 'testuser', password: 'pass' };

    user.findOne.mockRejectedValue(new Error('DB failure'));

    await postlogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ errorMessage: "Error processing data" });
  });


  // it('should handle internal server error', async () => {
  //   req.body = { username: 'testuser', password: 'pass' };
  //   user.findOne.mockRejectedValue(new Error('DB failure'));
  
  //   const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
  //   await postlogin(req, res);
  
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ errorMessage: "Error processing data" });
  
  //   logSpy.mockRestore();
  // });
  
});

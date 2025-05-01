// const { addtocart, getcartgames, removetocart } = require('../controllers/cartController');
// const user = require('../models/accountschema');
// const game_details = require('../models/gameschema');

// jest.mock('../models/accountschema');
// jest.mock('../models/gameschema');

// describe('Cart Controller Unit Tests', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       cookies: {},
//       body: {},
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     jest.clearAllMocks();
//   });

//   // --- addtocart tests ---
//   describe('addtocart', () => {
//     it('should add game to user cart successfully', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = { game_name: 'testgame' };

//       const saveMock = jest.fn();
//       user.findOne.mockResolvedValue({ cart: [], save: saveMock });

//       await addtocart(req, res);

//       expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
//       expect(saveMock).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({ successMsg: 'Successfully Added To Cart. Visit Cart To BUY' });
//     });

//     it('should return 400 if game name is not string', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = { game_name: 123 };

//       user.findOne.mockResolvedValue({ cart: [], save: jest.fn() });

//       await addtocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Invalid game name format' });
//     });

//     it('should return 404 if user not logged in', async () => {
//       await addtocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login to get access to the cart' });
//     });

//     it('should handle internal server error', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = { game_name: 'testgame' };

//       user.findOne.mockRejectedValue(new Error('DB Error'));

//       await addtocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Internal Server Error' });
//     });
//   });

//   // --- getcartgames tests ---
//   describe('getcartgames', () => {
//     it('should return cart games successfully', async () => {
//       req.cookies.username = 'testuser';

//       user.findOne.mockResolvedValue({ cart: ['game1', 'game2'] });
//       game_details.findOne
//         .mockResolvedValueOnce({ game_name: 'game1' })
//         .mockResolvedValueOnce({ game_name: 'game2' });

//       await getcartgames(req, res);

//       expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
//       expect(game_details.findOne).toHaveBeenCalledTimes(2);
//       expect(res.json).toHaveBeenCalledWith([{ game_name: 'game1' }, { game_name: 'game2' }]);
//     });

//     it('should skip if some games are not found', async () => {
//       req.cookies.username = 'testuser';

//       user.findOne.mockResolvedValue({ cart: ['game1', 'game2'] });
//       game_details.findOne
//         .mockResolvedValueOnce({ game_name: 'game1' })
//         .mockResolvedValueOnce(null);

//       await getcartgames(req, res);

//       expect(res.json).toHaveBeenCalledWith([{ game_name: 'game1' }]);
//     });

//     it('should return 401 if user not logged in', async () => {
//       await getcartgames(req, res);

//       expect(res.status).toHaveBeenCalledWith(401);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login First To get Acess of the cart ' });
//     });

//     it('should handle internal server error', async () => {
//       req.cookies.username = 'testuser';

//       user.findOne.mockRejectedValue(new Error('DB Error'));

//       await getcartgames(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Error processing data' });
//     });
//   });

//   // --- removetocart tests ---
//   describe('removetocart', () => {
//     it('should remove game from user cart successfully', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = 'testgame';

//       game_details.findOne.mockResolvedValue({ game_name: 'testgame' });
//       user.findOneAndUpdate.mockResolvedValue({});

//       await removetocart(req, res);

//       expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'testgame' });
//       expect(user.findOneAndUpdate).toHaveBeenCalledWith(
//         { username: 'testuser' },
//         { $pull: { cart: 'testgame' } }
//       );
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({ successMsg: 'Removed From Cart' });
//     });

//     it('should return 401 if game not found', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = 'nonexistentgame';

//       game_details.findOne.mockResolvedValue(null);

//       await removetocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(401);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Game Not Found' });
//     });

//     it('should return 401 if user not logged in', async () => {
//       await removetocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(401);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login First To get Acess of the cart ' });
//     });

//     it('should handle internal server error', async () => {
//       req.cookies.username = 'testuser';
//       req.body.cart_games = 'testgame';

//       game_details.findOne.mockRejectedValue(new Error('DB Error'));

//       await removetocart(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Internal Server Error' });
//     });
//   });
// });



const { addtocart, getcartgames, removetocart } = require('../controllers/cartController');
const user = require('../models/accountschema');
const game_details = require('../models/gameschema');

jest.mock('../models/accountschema');
jest.mock('../models/gameschema');

describe('Cart Controller Unit Tests', () => {
  let req, res;

  // Mock console.error and console.log
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    req = {
      cookies: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --- addtocart tests ---
  describe('addtocart', () => {
    it('should add game to user cart successfully', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = { game_name: 'testgame' };

      const saveMock = jest.fn();
      user.findOne.mockResolvedValue({ cart: [], save: saveMock });

      await addtocart(req, res);

      expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ successMsg: 'Successfully Added To Cart. Visit Cart To BUY' });
    });

    it('should return 400 if game name is not string', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = { game_name: 123 };

      user.findOne.mockResolvedValue({ cart: [], save: jest.fn() });

      await addtocart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Invalid game name format' });
    });

    it('should return 404 if user not logged in', async () => {
      await addtocart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login to get access to the cart' });
    });

    it('should handle internal server error', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = { game_name: 'testgame' };

      user.findOne.mockRejectedValue(new Error('DB Error'));

      await addtocart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Internal Server Error' });
    });
  });

  // --- getcartgames tests ---
  describe('getcartgames', () => {
    it('should return cart games successfully', async () => {
      req.cookies.username = 'testuser';

      user.findOne.mockResolvedValue({ cart: ['game1', 'game2'] });
      game_details.findOne
        .mockResolvedValueOnce({ game_name: 'game1' })
        .mockResolvedValueOnce({ game_name: 'game2' });

      await getcartgames(req, res);

      expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(game_details.findOne).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith([{ game_name: 'game1' }, { game_name: 'game2' }]);
    });

    it('should skip if some games are not found', async () => {
      req.cookies.username = 'testuser';

      user.findOne.mockResolvedValue({ cart: ['game1', 'game2'] });
      game_details.findOne
        .mockResolvedValueOnce({ game_name: 'game1' })
        .mockResolvedValueOnce(null);

      await getcartgames(req, res);

      expect(res.json).toHaveBeenCalledWith([{ game_name: 'game1' }]);
    });

    it('should return 401 if user not logged in', async () => {
      await getcartgames(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login First To get Acess of the cart ' });
    });

    it('should handle internal server error', async () => {
      req.cookies.username = 'testuser';

      user.findOne.mockRejectedValue(new Error('DB Error'));

      await getcartgames(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Error processing data' });
    });
  });

  // --- removetocart tests ---
  describe('removetocart', () => {
    it('should remove game from user cart successfully', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = 'testgame';

      game_details.findOne.mockResolvedValue({ game_name: 'testgame' });
      user.findOneAndUpdate.mockResolvedValue({});

      await removetocart(req, res);

      expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'testgame' });
      expect(user.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'testuser' },
        { $pull: { cart: 'testgame' } }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ successMsg: 'Removed From Cart' });
    });

    it('should return 401 if game not found', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = 'nonexistentgame';

      game_details.findOne.mockResolvedValue(null);

      await removetocart(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Game Not Found' });
    });

    it('should return 401 if user not logged in', async () => {
      await removetocart(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Login First To get Acess of the cart ' });
    });

    it('should handle internal server error', async () => {
      req.cookies.username = 'testuser';
      req.body.cart_games = 'testgame';

      game_details.findOne.mockRejectedValue(new Error('DB Error'));

      await removetocart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Internal Server Error' });
    });
  });
});
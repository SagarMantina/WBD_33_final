// // controller2.test.js
// const { postreview, getclickgame, getComparisons } = require('../controllers/gamepageController'); // <-- replace this

// const game_details = require('../models/gameschema');

// jest.mock('../models/gameschema');

// describe('Game Controller Functions', () => {

//   let req;
//   let res;

//   beforeEach(() => {
//     req = {
//       cookies: {},
//       body: {},
//       params: {}
//     };
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };
//     jest.clearAllMocks();
//   });

//   // postreview
//   describe('postreview', () => {

//     beforeEach(() => {
//       consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
//     });
  
//     afterEach(() => {
//       consoleErrorMock.mockRestore();
//     });
//     it('should post a new review successfully', async () => {
//       req.body = { postreview: 'Great game!', reviewrating: 5 };
//       req.params = { gamename: 'TestGame' };
//       req.cookies.username = 'testuser';

//       const mockGame = {
//         game_name: 'TestGame',
//         rating: 4,
//         reviews: [],
//         save: jest.fn().mockResolvedValue('updatedGameData')
//       };
     
//       game_details.findOne.mockResolvedValue(mockGame);

//       await postreview(req, res);

//       expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
//       expect(mockGame.reviews.length).toBe(1);
//       expect(mockGame.save).toHaveBeenCalled();
//       expect(res.json).toHaveBeenCalledWith({ updatedGameData: 'updatedGameData' });
//     });

//     it('should return 404 if game not found', async () => {
//       req.params = { gamename: 'UnknownGame' };
//       game_details.findOne.mockResolvedValue(null);

//       await postreview(req, res);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ message: "Game not found!" });
//     });

//     it('should return 401 if user is not logged in', async () => {
//       req.params = { gamename: 'TestGame' };
//       req.cookies = {}; // No username
//       game_details.findOne.mockResolvedValue({});

//       await postreview(req, res);

//       expect(res.status).toHaveBeenCalledWith(401);
//       expect(res.json).toHaveBeenCalledWith({ message: "Please login to post a review!" });
//     });

//     it('should return 401 if user already reviewed', async () => {
//       req.body = { postreview: 'Good!', reviewrating: 4 };
//       req.params = { gamename: 'TestGame' };
//       req.cookies.username = 'testuser';

//       const mockGame = {
//         game_name: 'TestGame',
//         rating: 4,
//         reviews: [{ name: 'testuser', review: 'Nice', rating: 4 }],
//       };

//       game_details.findOne.mockResolvedValue(mockGame);

//       await postreview(req, res);

//       expect(res.status).toHaveBeenCalledWith(401);
//       expect(res.json).toHaveBeenCalledWith({ message: "You have already reviewed and rated the game!" });
//     });

//     it("should handle internal server error", async () => {
//       const req = mockRequest({ /* your req setup */ });
//       const res = mockResponse();
  
//       const mockError = new Error("DB error");
  
//       // mock your DB function to throw error
//       jest.spyOn(Game, 'findOne').mockRejectedValue(mockError);
  
//       await postReview(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
//       expect(consoleErrorMock).toHaveBeenCalledWith("Error posting review:", mockError);
//     });
    
//   });

//   // getclickgame
//   describe('getclickgame', () => {
//     it('should return game details if found', async () => {
//       req.params = { gamename: 'TestGame' };
//       const mockProduct = { game_name: 'TestGame' };

//       game_details.findOne.mockResolvedValue(mockProduct);

//       await getclickgame(req, res);

//       expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
//       expect(res.json).toHaveBeenCalledWith(mockProduct);
//     });

//     it('should return 404 if game not found', async () => {
//       req.params = { gamename: 'TestGame' };
//       game_details.findOne.mockResolvedValue(null);

//       await getclickgame(req, res);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: "Product not found" });
//     });

//     it('should handle internal server error', async () => {
//       req.params = { gamename: 'TestGame' };
//       game_details.findOne.mockRejectedValue(new Error('DB error'));

//       await getclickgame(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
//     });
//   });

//   // getComparisons
//   describe('getComparisons', () => {
//     it('should return comparison games if product found', async () => {
//       req.params = { gamename: 'TestGame' };
//       const mockProduct = { price: 100, category: 'Action' };

//       game_details.findOne.mockResolvedValue(mockProduct);
//       game_details.find.mockResolvedValue([
//         { price: 90 },
//         { price: 110 },
//         { price: 95 }
//       ]);

//       await getComparisons(req, res);

//       expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
//       expect(game_details.find).toHaveBeenCalled();
//       expect(res.json).toHaveBeenCalled();
//     });

//     it('should return 404 if product not found', async () => {
//       req.params = { gamename: 'TestGame' };
//       game_details.findOne.mockResolvedValue(null);

//       await getComparisons(req, res);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ errorMessage: "Product not found" });
//     });

//     it('should handle internal server error', async () => {
//       req.params = { gamename: 'TestGame' };
//       game_details.findOne.mockRejectedValue(new Error('DB error'));

//       await getComparisons(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errorMessage: "Internal Server Error" }));
//     });
//   });

// });





const { postreview, getclickgame, getComparisons } = require('../controllers/gamepageController');
const game_details = require('../models/gameschema');

jest.mock('../models/gameschema');

describe('Game Controller Functions', () => {
  let req, res, consoleErrorMock;

  beforeEach(() => {
    req = {
      cookies: {},
      body: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  // postreview
  describe('postreview', () => {
    it('should post a new review successfully', async () => {
      req.body = { postreview: 'Great game!', reviewrating: 5 };
      req.params = { gamename: 'TestGame' };
      req.cookies.username = 'testuser';

      const mockGame = {
        game_name: 'TestGame',
        rating: 4,
        reviews: [],
        save: jest.fn().mockResolvedValue('updatedGameData')
      };

      game_details.findOne.mockResolvedValue(mockGame);

      await postreview(req, res);

      expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
      expect(mockGame.reviews.length).toBe(1);
      expect(mockGame.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ updatedGameData: 'updatedGameData' });
    });

    it('should return 404 if game not found', async () => {
      req.params = { gamename: 'UnknownGame' };
      req.cookies.username = 'testuser';

      game_details.findOne.mockResolvedValue(null);

      await postreview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Game not found!" });
    });

    it('should return 401 if user is not logged in', async () => {
      req.params = { gamename: 'TestGame' };
      req.cookies = {}; // No username
      game_details.findOne.mockResolvedValue({});

      await postreview(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Please login to post a review!" });
    });

    it('should return 401 if user already reviewed', async () => {
      req.body = { postreview: 'Good!', reviewrating: 4 };
      req.params = { gamename: 'TestGame' };
      req.cookies.username = 'testuser';

      const mockGame = {
        game_name: 'TestGame',
        rating: 4,
        reviews: [{ name: 'testuser', review: 'Nice', rating: 4 }],
      };

      game_details.findOne.mockResolvedValue(mockGame);

      await postreview(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You have already reviewed and rated the game!" });
    });

    it("should handle internal server error", async () => {
      req.body = { postreview: 'Cool', reviewrating: 5 };
      req.params = { gamename: 'TestGame' };
      req.cookies.username = 'testuser';

      const mockError = new Error("DB error");

      game_details.findOne.mockRejectedValue(mockError);

      await postreview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
      expect(consoleErrorMock).toHaveBeenCalledWith("Error posting review:", mockError);
    });
  });

  // getclickgame
  describe('getclickgame', () => {
    it('should return game details if found', async () => {
      req.params = { gamename: 'TestGame' };
      const mockProduct = { game_name: 'TestGame' };

      game_details.findOne.mockResolvedValue(mockProduct);

      await getclickgame(req, res);

      expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if game not found', async () => {
      req.params = { gamename: 'TestGame' };
      game_details.findOne.mockResolvedValue(null);

      await getclickgame(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "Product not found" });
    });

    it('should handle internal server error', async () => {
      req.params = { gamename: 'TestGame' };
      game_details.findOne.mockRejectedValue(new Error('DB error'));

      await getclickgame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
    });
  });

    describe('getComparisons', () => {
    it('should return comparison games if product found', async () => {
      req.params = { gamename: 'TestGame' };
      const mockProduct = { price: 100, category: 'Action' };

      game_details.findOne.mockResolvedValue(mockProduct);
      game_details.find.mockResolvedValue([
        { price: 90 },
        { price: 110 },
        { price: 95 }
      ]);

      await getComparisons(req, res);

      expect(game_details.findOne).toHaveBeenCalledWith({ game_name: 'TestGame' });
      expect(game_details.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if product not found', async () => {
      req.params = { gamename: 'TestGame' };
      game_details.findOne.mockResolvedValue(null);

      await getComparisons(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "Product not found" });
    });

    it('should handle internal server error', async () => {
      req.params = { gamename: 'TestGame' };
      game_details.findOne.mockRejectedValue(new Error('DB error'));

      await getComparisons(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errorMessage: "Internal Server Error" }));
    });
  });
});

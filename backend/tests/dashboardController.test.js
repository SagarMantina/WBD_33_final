
const { 
    getuserdata, 
    signout, 
    getaTransactions, 
    getsTransactions, 
    getuTransactions, 
    admindeletegame, 
    geteveryUser 
  } = require('../controllers/dashboardController');
  
  const user = require('../models/accountschema');
  const transaction = require('../models/transactionSchema');
  const game_details = require('../models/gameschema');
  
  jest.mock('../models/accountschema');
  jest.mock('../models/transactionSchema');
  jest.mock('../models/gameschema');
  
  describe('Controller Functions', () => {
  
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        cookies: {},
        body: {},
        query: {}
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        clearCookie: jest.fn()
      };
      jest.clearAllMocks();
    });
  
    // getuserdata
    describe('getuserdata', () => {
      it('should return user data if found', async () => {
        req.cookies.username = 'testuser';
        user.findOne.mockResolvedValue({ username: 'testuser' });
  
        await getuserdata(req, res);
  
        expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(res.json).toHaveBeenCalledWith({ username: 'testuser' });
      });
  
      it('should return 401 on error', async () => {
        req.cookies.username = 'testuser';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getuserdata(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
      });
    });
  
    // signout
    describe('signout', () => {
      it('should clear cookie and logout', async () => {
        req.cookies.username = 'testuser';
  
        await signout(req, res);
  
        expect(res.clearCookie).toHaveBeenCalledWith('username');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ successMsg: "User Logged Out" });
      });
    });
  
    // deletegame
    // describe('deletegame', () => {
    //   it('should delete a game successfully', async () => {
    //     req.body.game_name = 'testgame';
    //     game_details.deleteOne.mockResolvedValue({ deletedCount: 1 });
  
    //     await deletegame(req, res);
  
    //     expect(game_details.deleteOne).toHaveBeenCalledWith({ name: 'testgame' });
    //     expect(res.json).toHaveBeenCalledWith({ message: "Game deleted successfully" });
    //   });
  
    //   it('should return 404 if game not found', async () => {
    //     req.body.game_name = 'testgame';
    //     game_details.deleteOne.mockResolvedValue(null);
  
    //     await deletegame(req, res);
  
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.json).toHaveBeenCalledWith({ error: "Game not found" });
    //   });
  
    //   it('should handle internal server error', async () => {
    //     req.body.game_name = 'testgame';
    //     game_details.deleteOne.mockRejectedValue(new Error('DB Error'));
  
    //     await deletegame(req, res);
  
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    //   });
    // });
     

    describe('deletegame', () => {
      let consoleErrorMock;
    
      beforeAll(() => {
        // Mock console.error
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      });
    
      afterAll(() => {
        // Restore the mock
        consoleErrorMock.mockRestore();
      });
    
      it('should delete a game successfully', async () => {
        req.body.game_name = 'testgame';
        game_details.deleteOne.mockResolvedValue({ deletedCount: 1 });
    
        await admindeletegame(req, res);
    
        expect(game_details.deleteOne).toHaveBeenCalledWith({ name: 'testgame' });
        expect(res.json).toHaveBeenCalledWith({ message: "Game deleted successfully" });
      });
    
      it('should return 404 if game not found', async () => {
        req.body.game_name = 'testgame';
        game_details.deleteOne.mockResolvedValue(null);
    
        await admindeletegame(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Game not found" });
      });
    
      it('should handle internal server error', async () => {
        const mockError = new Error('DB Error');
        req.body.game_name = 'testgame';
        game_details.deleteOne.mockRejectedValue(mockError);
      
        await admindeletegame(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
       
        expect(consoleErrorMock).toHaveBeenCalledWith("Error deleting game:", mockError);
      });
      
    });
    
    // getaTransactions
    describe('getaTransactions', () => {
      it('should return all transactions if user is logged in', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockResolvedValue({ buyer: 'buyer1' });
        transaction.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
  
        await getaTransactions(req, res);
  
        expect(transaction.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockResolvedValue(null);
  
        await getaTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Login to see Transactions" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getaTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
      });
    });
  
    // getuTransactions
    describe('getuTransactions', () => {
      it('should return user specific transactions', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockResolvedValue({ username: 'buyer1' });
        transaction.find.mockResolvedValue([{ id: 3 }]);
  
        await getuTransactions(req, res);
  
        expect(transaction.find).toHaveBeenCalledWith({ username: 'buyer1' });
        expect(res.json).toHaveBeenCalledWith([{ id: 3 }]);
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockResolvedValue(null);
  
        await getuTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Login to see Transactions" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'buyer1';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getuTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
      });
    });
  
    // getsTransactions
    describe('getsTransactions', () => {
      it('should return seller specific transactions', async () => {
        req.cookies.username = 'seller1';
        user.findOne.mockResolvedValue({ username: 'seller1' });
        transaction.find.mockResolvedValue([{ id: 5 }]);
  
        await getsTransactions(req, res);
  
        expect(transaction.find).toHaveBeenCalledWith({ username: 'seller1' });
        expect(res.json).toHaveBeenCalledWith([{ id: 5 }]);
      });
  
      it('should return 404 if seller not found', async () => {
        req.cookies.username = 'seller1';
        user.findOne.mockResolvedValue(null);
  
        await getsTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Login to see Transactions" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'seller1';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getsTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
      });
    });
  
    // geteveryUser
    describe('geteveryUser', () => {
      it('should return all users', async () => {
        user.find.mockResolvedValue([{ username: 'user1' }, { username: 'user2' }]);
  
        await geteveryUser(req, res);
  
        expect(user.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ username: 'user1' }, { username: 'user2' }]);
      });
  
      it('should handle internal server error', async () => {
        user.find.mockRejectedValue(new Error('DB Error'));
  
        await geteveryUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
      });
    });
  
  });
  
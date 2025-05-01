
const {
    getSellerdata,
    sellGame,
    getsellerMyGames,
    getsellerTransactions,
    deleteGame,
    updateGame,
  } = require('../controllers/sellerController'); 

  
  const user = require('../models/accountschema');
  const transaction = require('../models/transactionSchema');
  const game_details = require('../models/gameschema');
  
  jest.mock('../models/accountschema');
  jest.mock('../models/transactionSchema');
  jest.mock('../models/gameschema');
  
  describe('Seller Controller Functions', () => {
    
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {},
        cookies: {}
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      jest.clearAllMocks();
    });
  
    // getSellerdata
    describe('getSellerdata', () => {
      it('should return seller data if user exists', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockResolvedValue({ username: 'sellerUser' });
  
        await getSellerdata(req, res);
  
        expect(user.findOne).toHaveBeenCalledWith({ username: 'sellerUser' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ seller: { username: 'sellerUser' } });
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockResolvedValue(null);
  
        await getSellerdata(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "PLEASE DO LOGIN!!!" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getSellerdata(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Sever Error");
      });
    });
  
    // sellGame
    describe('sellGame', () => {
      it('should allow seller to post a new game', async () => {
        req.cookies.username = 'sellerUser';
        req.body = { gamename: 'NewGame' };
  
        user.findOne.mockResolvedValue({ username: 'sellerUser' });
        game_details.findOne.mockResolvedValue(null);
        game_details.prototype.save = jest.fn();
  
        await sellGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ successMessage: "Game Added Successfully" });
      });
  
      it('should return 400 if game already exists', async () => {
        req.cookies.username = 'sellerUser';
        req.body = { gamename: 'ExistingGame' };
  
        user.findOne.mockResolvedValue({ username: 'sellerUser' });
        game_details.findOne.mockResolvedValue({ game_name: 'ExistingGame' });
  
        await sellGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Game Already Exists" });
      });
  
      it('should return 401 if seller is not logged in', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockResolvedValue(null);
  
        await sellGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "PLEASE DO LOGIN!!!" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await sellGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
      });
    });
  
    // getsellerMyGames
    describe('getsellerMyGames', () => {
      it('should return seller games', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockResolvedValue({ username: 'sellerUser' });
        game_details.find.mockResolvedValue([{ game_name: 'Game1' }]);
  
        await getsellerMyGames(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ myGames: [{ game_name: 'Game1' }] });
      });
  
      it('should return 404 if seller not logged in', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockResolvedValue(null);
  
        await getsellerMyGames(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "PLEASE DO LOGIN!!!" });
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'sellerUser';
        user.findOne.mockRejectedValue(new Error('DB Error'));
  
        await getsellerMyGames(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Sever Error");
      });
    });
  
    // getsellerTransactions
    describe('getsellerTransactions', () => {
      it('should return seller transactions', async () => {
        req.cookies.username = 'sellerUser';
        transaction.find.mockResolvedValue([{ buyer: 'buyer1' }]);
  
        await getsellerTransactions(req, res);
  
        expect(transaction.find).toHaveBeenCalledWith({ seller: 'sellerUser' });
        expect(res.json).toHaveBeenCalledWith([{ buyer: 'buyer1' }]);
      });
  
      it('should handle internal server error', async () => {
        req.cookies.username = 'sellerUser';
        transaction.find.mockRejectedValue(new Error('DB Error'));
  
        await getsellerTransactions(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error !" });
      });
    });
  
    // updateGame
    describe('updateGame', () => {
      it('should update a game successfully', async () => {
        req.params.gameId = '123';
        req.body = { game_name: 'UpdatedGame', price: 99, category: 'Action' };
  
        game_details.findByIdAndUpdate.mockResolvedValue({ game_name: 'UpdatedGame' });
  
        await updateGame(req, res);
  
        expect(game_details.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          successMessage: "Game updated successfully",
          updatedGame: { game_name: 'UpdatedGame' }
        });
      });
  
      it('should return 404 if game not found during update', async () => {
        req.params.gameId = '123';
        game_details.findByIdAndUpdate.mockResolvedValue(null);
  
        await updateGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Game not found!" });
      });
  
      it('should handle internal server error', async () => {
        req.params.gameId = '123';
        game_details.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));
  
        await updateGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
      });
    });
  
    // deleteGame
    describe('deleteGame', () => {
      it('should delete a game successfully', async () => {
        req.params.gameId = '123';
        req.cookies.username = 'sellerUser';
  
        game_details.findOne.mockResolvedValue({ _id: '123' });
  
        await deleteGame(req, res);
  
        expect(game_details.deleteOne).toHaveBeenCalledWith({ _id: '123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ successMessage: "Game deleted successfully" });
      });
  
      it('should return 404 if game not found for deletion', async () => {
        req.params.gameId = '123';
        req.cookies.username = 'sellerUser';
  
        game_details.findOne.mockResolvedValue(null);
  
        await deleteGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: "Game not found!" });
      });
  
      it('should handle internal server error', async () => {
        req.params.gameId = '123';
        req.cookies.username = 'sellerUser';
  
        game_details.findOne.mockRejectedValue(new Error('DB Error'));
  
        await deleteGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
      });
    });
  
  });
  
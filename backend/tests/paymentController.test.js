// controllers.test.js
const { paygame, cartpaygame, getTopSellingGames, getTopRevenueGames } = require('../controllers/paymentController');
const user = require('../models/accountschema');
const transaction = require('../models/transactionSchema');
const game_details = require('../models/gameschema');

jest.mock('../models/accountschema');
jest.mock('../models/transactionSchema');
jest.mock('../models/gameschema');

describe('Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('paygame', () => {
        it('should return error if user not logged in', async () => {
            req.headers = {}; // instead of undefined
            req.body = { game_name: "testgame" };
        
            await paygame(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ errorMessage: "Please Login To Purchase" });
        });
        

        it('should return message if game already purchased', async () => {
            req.headers = { 'x-username': 'testuser' };
            req.body = { game_name: "testgame" };
        
            user.findOne.mockResolvedValue({ username: "testuser", purchase: ["testgame"], save: jest.fn() });
            game_details.findOne.mockResolvedValue({ game_name: "testgame" });
        
            await paygame(req, res);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "User has already purchased the game" });
        });
        

        it('should successfully purchase a game', async () => {
            req.headers = { 'x-username': 'testuser' };
            req.body = { game_name: "newgame" };
        
            const mockUser = { username: "testuser", purchase: [], save: jest.fn() };
            const mockGame = { game_name: "newgame", quantity_sold: 0, price: 100, seller: "seller1", save: jest.fn() };
            const mockTransactionSave = jest.fn();
        
            user.findOne.mockResolvedValue(mockUser);
            game_details.findOne.mockResolvedValue(mockGame);
        
            // Fix the typo here from 'transcation' to 'transaction'
            transaction.mockImplementation(() => ({ save: mockTransactionSave }));
        
            await paygame(req, res);
        
            expect(mockUser.purchase).toContain("newgame");
            expect(mockGame.quantity_sold).toBe(1);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockGame.save).toHaveBeenCalled();
            expect(mockTransactionSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Successfully purchased the game" });
        });
        
        
    });

    describe('cartpaygame', () => {
        it('should return error if cart is empty', async () => {
            req.headers = { 'x-username': 'testuser' };

            user.findOne.mockResolvedValue({ username: "testuser", cart: [], purchase: [], save: jest.fn() });

            await cartpaygame(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errorMessage: "Cart is empty" });
        });

        it('should successfully purchase games from cart', async () => {
            req.headers = { 'x-username': 'testuser' };

            const mockUser = {
                username: "testuser",
                cart: ["game1", "game2"],
                purchase: [],
                save: jest.fn()
            };

            const mockGame1 = { game_name: "game1", quantity_sold: 0, price: 50, seller: "seller1", broughtBy: [], save: jest.fn() };
            const mockGame2 = { game_name: "game2", quantity_sold: 0, price: 70, seller: "seller2", broughtBy: [], save: jest.fn() };
            const mockTransactionSave = jest.fn();

            user.findOne.mockResolvedValue(mockUser);
            game_details.findOne
                .mockImplementation((query) => {
                    if (query.game_name === "game1") return Promise.resolve(mockGame1);
                    if (query.game_name === "game2") return Promise.resolve(mockGame2);
                });
            transaction.mockImplementation(() => ({ save: mockTransactionSave }));

            await cartpaygame(req, res);

            expect(mockUser.purchase).toContain("game1");
            expect(mockUser.purchase).toContain("game2");
            expect(mockUser.cart).toHaveLength(0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Successfully purchased the game(s)" });
        });
    });

    describe('getTopSellingGames', () => {
        it('should return top selling games', async () => {
            const topGames = [{ game_name: "game1" }, { game_name: "game2" }];
            game_details.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(topGames) }) });

            await getTopSellingGames(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Top 10 Games by Quantity Sold",
                data: topGames
            });
        });
    });

    describe('getTopRevenueGames', () => {
        it('should return top revenue games', async () => {
            const topRevenueGames = [{ game_name: "game1", totalRevenue: 1000 }];
            game_details.aggregate.mockResolvedValue(topRevenueGames);

            await getTopRevenueGames(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Top 10 Games by Highest Revenue",
                data: topRevenueGames
            });
        });
    });
});

const bcrypt = require("bcryptjs");
const { updateuserdetails, getuserTransactions, getuserMyGames, checkUser } = require("../controllers/userController");

jest.mock("../models/accountschema", () => ({
  findOne: jest.fn(),
}));
jest.mock("../models/transactionSchema", () => ({
  find: jest.fn(),
}));
jest.mock("../models/gameschema", () => ({
  find: jest.fn(),
}));

const user = require("../models/accountschema");
const transaction = require("../models/transactionSchema");
const game_details = require("../models/gameschema");

describe("userController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("updateuserdetails", () => {
    it("should return 401 if user not found", async () => {
      user.findOne.mockReturnValueOnce({ explain: jest.fn().mockResolvedValue(null) });
      await updateuserdetails(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "User not found" });
    });

    it("should update username, email and password successfully", async () => {
      const hashedPassword = await bcrypt.hash("oldpass", 10);
      const userObj = { username: "old", password: hashedPassword, save: jest.fn() };
      req.cookies.username = "old";
      req.body = { name: "newname", email: "new@example.com", password: "newpass" };

      user.findOne
        .mockReturnValueOnce({ explain: jest.fn().mockResolvedValue(true) }) // for first findOne with explain
        .mockResolvedValueOnce(userObj); // for second actual user

      bcrypt.compare = jest.fn().mockResolvedValue(false); // password is different
      bcrypt.hash = jest.fn().mockResolvedValue("hashed_new");

      await updateuserdetails(req, res);

      expect(userObj.username).toBe("newname");
      expect(userObj.email).toBe("new@example.com");
      expect(userObj.password).toBe("hashed_new");
      expect(userObj.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User details updated successfully." });
    });

    it("should return 401 if password is same", async () => {
      const hashedPassword = await bcrypt.hash("same", 10);
      const userObj = { username: "user", password: hashedPassword, save: jest.fn() };
      req.cookies.username = "user";
      req.body = { password: "same" };

      user.findOne
        .mockReturnValueOnce({ explain: jest.fn().mockResolvedValue(true) })
        .mockResolvedValueOnce(userObj);

      bcrypt.compare = jest.fn().mockResolvedValue(true); // password is same

      await updateuserdetails(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "Please enter a different password" });
    });

    it("should return 400 if no fields provided", async () => {
      const userObj = { username: "user", password: "pass", save: jest.fn() };
      req.cookies.username = "user";
      req.body = {};

      user.findOne
        .mockReturnValueOnce({ explain: jest.fn().mockResolvedValue(true) })
        .mockResolvedValueOnce(userObj);

      await updateuserdetails(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "No valid fields provided to update." });
    });
  });

  describe("getuserTransactions", () => {
    it("should return transactions", async () => {
      req.cookies.username = "testuser";
      const txs = [{ id: 1 }];
      transaction.find.mockResolvedValue(txs);

      await getuserTransactions(req, res);
      expect(transaction.find).toHaveBeenCalledWith({ buyer: "testuser" });
      expect(res.json).toHaveBeenCalledWith(txs);
    });

    it("should handle errors", async () => {
      transaction.find.mockRejectedValue(new Error("DB error"));

      await getuserTransactions(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error !" });
    });
  });

  describe("getuserMyGames", () => {
    it("should return 404 if user not found", async () => {
      req.cookies.username = "testuser";
      user.findOne.mockResolvedValue(null);

      await getuserMyGames(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "PLEASE DO LOGIN!!!" });
    });

    it("should return 404 if no games found", async () => {
      req.cookies.username = "testuser";
      user.findOne.mockResolvedValue({ username: "testuser" });
      game_details.find.mockResolvedValue([]);

      await getuserMyGames(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "No games found for this user." });
    });

    it("should return 200 with myGames", async () => {
      req.cookies.username = "testuser";
      const games = [{ title: "Game A" }];
      user.findOne.mockResolvedValue({ username: "testuser" });
      game_details.find.mockResolvedValue(games);

      await getuserMyGames(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ myGames: games });
    });
  });

  describe("checkUser", () => {
    it("should return 404 if user not found", async () => {
      req.params.username = "notfound";
      user.findOne.mockResolvedValue(null);

      await checkUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errorMessage: "User not found" });
    });

    it("should return 200 if user found", async () => {
      req.params.username = "found";
      user.findOne.mockResolvedValue({ username: "found" });

      await checkUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User found successfully." });
    });

    it("should handle internal server error", async () => {
      req.params.username = "error";
      user.findOne.mockRejectedValue(new Error("DB error"));

      await checkUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Internal server issues ");
    });
  });
});

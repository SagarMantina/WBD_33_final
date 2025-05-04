const {
  getadmindata,
  getTransactions,
  getGames,
  getallUsers,
  admin_update_user,
  admin_create_user,
  admin_delete_user,
  admin_delete_community,
  admin_delete_community_message,
} = require('../controllers/adminController');

const user = require('../models/accountschema');
const game_details = require('../models/gameschema');
const transaction = require('../models/transactionSchema');
const community = require('../models/commmunitySchema');

jest.mock('../models/accountschema');
jest.mock('../models/gameschema');
jest.mock('../models/transactionSchema');
jest.mock('../models/commmunitySchema');

describe('Admin Controller Unit Tests', () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  test('getadmindata should return dashboard stats correctly', async () => {
    game_details.countDocuments.mockResolvedValueOnce(10);
    user.countDocuments.mockResolvedValueOnce(20);
    transaction.countDocuments
      .mockResolvedValueOnce(30) // total_purchases
      .mockResolvedValueOnce(10) // today_sales
      .mockResolvedValueOnce(5); // sales_increase

    await getadmindata({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      total_games: 10,
      total_users: 20,
      total_purchases: 30,
      today_sales: 10,
      sales_increase: 5,
    });
  });

  test('getTransactions should return all transactions', async () => {
    const transactions = [{ id: 1 }, { id: 2 }];
    transaction.find.mockResolvedValue(transactions);

    await getTransactions({}, res);

    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  test('getGames should return all games', async () => {
    const games = [{ title: 'Game1' }, { title: 'Game2' }];
    game_details.find.mockResolvedValue(games);

    await getGames({}, res);

    expect(res.json).toHaveBeenCalledWith(games);
  });

  test('getallUsers should return user stats', async () => {
    user.countDocuments
      .mockResolvedValueOnce(100) // total users
      .mockResolvedValueOnce(25); // today's users (if applicable in logic)

    await getallUsers({}, res);

    expect(res.json).toHaveBeenCalled();
  });

  // test('admin_update_user should update password if user exists', async () => {
  //   const req = { body: { username: 'sagar', newPassword: 'newpass' } };
  //   const mockUser = { password: 'oldpass', save: jest.fn().mockResolvedValue(true) };
  //   user.findOne.mockResolvedValue(mockUser);

  //   await admin_update_user(req, res);

  //   expect(mockUser.password).toBe('newpass');
  //   expect(mockUser.save).toHaveBeenCalled();
  //   expect(res.send).toHaveBeenCalledWith('Password updated successfully');
  // });

  test('admin_update_user should return error if user not found', async () => {
    const req = { body: { username: 'ghost', newPassword: '1234' } };
    user.findOne.mockResolvedValue(null);

    await admin_update_user(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User not found');
  });

  test('admin_create_user should create a user', async () => {
    const req = { body: { username: 'newuser', email: 'e', password: 'p' } };

   
    user.find
      .mockImplementationOnce(() => Promise.resolve([])) // for username check
      .mockImplementationOnce(() => Promise.resolve([])); // for email check

    
    const mockSave = jest.fn().mockResolvedValue(true);
    user.mockImplementation(() => ({ save: mockSave }));

    await admin_create_user(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('User created successfully');
  });

  test('admin_delete_user should delete user if exists', async () => {
    const req = { body: { username: 'sagar' } };
    user.findOne.mockResolvedValue(true);
    user.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await admin_delete_user(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
  });

  test('admin_delete_user should return error if user not found', async () => {
    const req = { body: { username: 'ghost' } };
    user.findOne.mockResolvedValue(null);

    await admin_delete_user(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('admin_delete_community should delete community if exists', async () => {
    const req = { body: { community_name: 'test' } };
    community.findOne.mockResolvedValue(true);
    community.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await admin_delete_community(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Community deleted successfully' });
  });

  test('admin_delete_community should return error if not found', async () => {
    const req = { body: { community_name: 'ghostgroup' } };
    community.findOne.mockResolvedValue(null);

    await admin_delete_community(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Community not found ' });
  });

  test('admin_delete_community_message should clear messages if community exists', async () => {
    const req = { body: { community_name: 'test' } };
    community.findOne.mockResolvedValue(true);
    community.updateOne.mockResolvedValue({ modifiedCount: 1 });

    await admin_delete_community_message(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted successfully' });
  });

  test('admin_delete_community_message should return error if community not found', async () => {
    const req = { body: { community_name: 'ghostgroup' } };
    community.findOne.mockResolvedValue(null);

    await admin_delete_community_message(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Community not found' });
  });
});

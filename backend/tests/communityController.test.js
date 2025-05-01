const {
    createCommunity,
    joinCommunity,
    getCommunity,
    getcommunityChat,
    sendMessage,
    getUserCommunities,
  } = require('../controllers/communityController');
  const community = require('../models/commmunitySchema');
  const user = require('../models/accountschema');
  
  jest.mock('../models/commmunitySchema');
  jest.mock('../models/accountschema');
  
  describe('Community Controller Unit Tests', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        cookies: {},
        body: {},
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });
  
    describe('createCommunity', () => {
      it('should create a new community successfully', async () => {
        req.cookies.username = 'testuser';
        req.body = { community_name: 'testCommunity', description: 'Test Description' };
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.findOne.mockResolvedValue(null);
        community.prototype.save = jest.fn();
  
        await createCommunity(req, res);
  
        expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(community.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: 'Community created successfully.' });
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'testuser';
  
        user.findOne.mockResolvedValue(null);
  
        await createCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
      });
  
      it('should return 400 if community already exists', async () => {
        req.cookies.username = 'testuser';
        req.body = { community_name: 'testCommunity' };
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.findOne.mockResolvedValue({ name: 'testCommunity' });
  
        await createCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Community already exists.' });
      });
    });
  
    describe('joinCommunity', () => {
      it('should join a community successfully', async () => {
        req.cookies.username = 'testuser';
        req.body = { communityName: 'testCommunity' };
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.findOne.mockResolvedValue({ user: [], save: jest.fn() });
  
        await joinCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: 'Joined the community.' });
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'testuser';
  
        user.findOne.mockResolvedValue(null);
  
        await joinCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
      });
  
      it('should return 404 if community not found', async () => {
        req.cookies.username = 'testuser';
        req.body = { communityName: 'testCommunity' };
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.findOne.mockResolvedValue(null);
  
        await joinCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Community not found.' });
      });
  
      it('should return 400 if already a member', async () => {
        req.cookies.username = 'testuser';
        req.body = { communityName: 'testCommunity' };
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.findOne.mockResolvedValue({ user: ['userId'] });
  
        await joinCommunity(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Already a member of the community.' });
      });
    });
  
    describe('getCommunity', () => {
      it('should return all communities', async () => {
        community.find.mockResolvedValue([{ name: 'testCommunity' }]);
  
        await getCommunity(req, res);
  
        expect(community.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith([{ name: 'testCommunity' }]);
      });
    });
  
    describe('getUserCommunities', () => {
      it('should return user communities', async () => {
        req.cookies.username = 'testuser';
  
        user.findOne.mockResolvedValue({ _id: 'userId' });
        community.find.mockResolvedValue([{ name: 'testCommunity' }]);
  
        await getUserCommunities(req, res);
  
        expect(user.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(community.find).toHaveBeenCalledWith({ user: 'userId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ name: 'testCommunity' }]);
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'testuser';
  
        user.findOne.mockResolvedValue(null);
  
        await getUserCommunities(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
      });
    });
  
    describe('getcommunityChat', () => {
      it('should return community chat successfully', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
    
        community.findOne.mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            name: 'testCommunity',
            messages: [{ sender: { username: 'user1' }, message: 'Hello' }],
          }),
        });
    
        user.findOne.mockResolvedValue({ username: 'testuser' });
    
        await getcommunityChat(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
          user: { username: 'testuser' },
          community: 'testCommunity',
          messages: [{ sender: { username: 'user1' }, message: 'Hello' }],
        });
      });
    
      it('should return 404 if community not found', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
    
        community.findOne.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
    
        await getcommunityChat(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Community not found.' });
      });
    
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
    
        community.findOne.mockReturnValue({
          populate: jest.fn().mockResolvedValue({ name: 'testCommunity', messages: [] }),
        });
    
        user.findOne.mockResolvedValue(null);
    
        await getcommunityChat(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: 'User not found.' });
      });
    });
    
  
    describe('sendMessage', () => {
      it('should send a message successfully', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
        req.body = { message: 'Hello' };
  
        community.findOne.mockResolvedValue({ messages: [], save: jest.fn() });
        user.findOne.mockResolvedValue({ _id: 'userId' });
  
        await sendMessage(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          successMessage: 'Message sent successfully.',
          message: { sender: 'userId', message: 'Hello' },
        });
      });
  
      it('should return 404 if community not found', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
  
        community.findOne.mockResolvedValue(null);
  
        await sendMessage(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Community not found.' });
      });
  
      it('should return 404 if user not found', async () => {
        req.cookies.username = 'testuser';
        req.params.community = 'testCommunity';
  
        community.findOne.mockResolvedValue({ name: 'testCommunity' });
        user.findOne.mockResolvedValue(null);
  
        await sendMessage(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMessage: 'User not found.' });
      });
    });
  });
  
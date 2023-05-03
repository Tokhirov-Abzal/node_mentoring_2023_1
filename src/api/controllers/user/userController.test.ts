import { UserService } from 'api/services';
import { UserController } from '..';
import { STATUS_CODES } from 'dictionary';

describe('User Controller', () => {
  let controller: typeof UserController;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  const mockUserBody = { login: 'TestName', password: '1234', age: 15, isDeleted: false };
  const mockUsers = [
    {
      id: 'fe2529d4-ba05-4c07-9ea3-5bc8037ae73e',
      login: 'Login1',
      password: '$2b$04$Cv.rtjJfH3hZxE.GpW85NutgtpCAHqvP3.ZxbyiSF4nCWVV.Kmr9y',
      age: 4,
      isDeleted: false,
    },
    {
      id: 'a237ed03-e49c-4771-a6d5-f04e73ed4687',
      login: 'Login12',
      password: '$2b$04$6nw.EIBK0VWRSf40abJ3deSEhMIagJJmKMEICEPVZnuhhQPSiG0.a',
      age: 14,
      isDeleted: false,
    },
  ];

  beforeEach(() => {
    controller = UserController;
    mockReq = { params: { id: 1 }, body: mockUserBody };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getAllUsers', () => {
    it('should return list of users', async () => {
      UserService.getEntityList = jest.fn().mockResolvedValue(mockUsers);

      await controller.getAllUsers(mockReq, mockRes, mockNext);

      expect(UserService.getEntityList).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should throw an error with 400 status code', async () => {
      const mockError = new Error('Error fetching users');
      UserService.getEntityList = jest.fn().mockRejectedValue(mockError);
      await controller.getAllUsers(mockReq, mockRes, mockNext);

      expect(UserService.getEntityList).toHaveBeenCalled();

      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      UserService.getEntityById = jest.fn().mockResolvedValue(mockUsers[0]);

      await controller.getUserById(mockReq, mockRes, mockNext);

      expect(UserService.getEntityById).toHaveBeenCalledWith({ id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should log error and return 400 status with error message when service throws error', async () => {
      const mockError = new Error('Error fetching user by id');
      UserService.getEntityById = jest.fn().mockRejectedValue(mockError);
      await controller.getUserById(mockReq, mockRes, mockNext);

      expect(UserService.getEntityById).toHaveBeenCalledWith({ id: 1 });

      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('createUser', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create an user and return success message', async () => {
      UserService.createOneEntity = jest.fn(() => Promise.resolve());

      await controller.createUser(mockReq, mockRes, mockNext);
      expect(UserService.createOneEntity).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS_CREATE);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is successfully created' });
    });
  });

  describe('updateUser', () => {
    it('should update the user and return success message', async () => {
      UserService.updateEntity = jest.fn(() => Promise.resolve());

      await controller.updateUser(mockReq, mockRes, mockNext);

      expect(UserService.updateEntity).toHaveBeenCalledWith(1, mockUserBody);
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is successfully updated' });
    });
  });

  describe('deleteUserById', () => {
    it('should delete the user and return success message', async () => {
      UserService.deleteEntity = jest.fn(() => Promise.resolve());

      await controller.deleteUserById(mockReq, mockRes, mockNext);

      expect(UserService.deleteEntity).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is successfully deleted' });
    });
  });
});

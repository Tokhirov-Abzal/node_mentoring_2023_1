import { GroupEntity } from 'entity';
import { GroupController } from '../';
import { GroupService } from 'api/services';
import { STATUS_CODES } from 'dictionary';

describe('Group Controller', () => {
  let controller: any;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  const mockGroup = { id: 1, name: 'Group 1', permissions: ['read'] };

  beforeEach(() => {
    controller = GroupController;
    mockReq = { params: { id: 1 }, body: mockGroup };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getAllGroups', () => {
    it('should return list of groups', async () => {
      const mockGroups = [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
      ];
      GroupService.getEntityList = jest.fn().mockResolvedValue(mockGroups);
      await controller.getAllGroups(mockReq, mockRes);

      expect(GroupService.getEntityList).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith(mockGroups);
    });

    it('should log error and return 400 status with error message when service throws error', async () => {
      const mockError = new Error('Error fetching groups');
      GroupService.getEntityList = jest.fn().mockRejectedValue(mockError);
      await controller.getAllGroups(mockReq, mockRes);

      expect(GroupService.getEntityList).toHaveBeenCalled();

      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('getGroupById', () => {
    it('should return group by id', async () => {
      GroupService.getEntityById = jest.fn().mockResolvedValue(mockGroup);
      await controller.getGroupById(mockReq, mockRes);

      expect(GroupService.getEntityById).toHaveBeenCalledWith({ id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith(mockGroup);
    });

    it('should log error and return 400 status with error message when service throws error', async () => {
      const mockError = new Error('Error fetching group by id');
      GroupService.getEntityById = jest.fn().mockRejectedValue(mockError);
      await controller.getGroupById(mockReq, mockRes);

      expect(GroupService.getEntityById).toHaveBeenCalledWith({ id: 1 });

      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('createGroup', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a group and return success message', async () => {
      GroupService.createOneEntity = jest.fn(() => Promise.resolve());

      await controller.createGroup(mockReq, mockRes);
      expect(GroupService.createOneEntity).toHaveBeenCalledWith(new GroupEntity(mockReq.body));
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS_CREATE);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group is successfully created' });
    });
  });

  describe('updateGroup', () => {
    it('should return a bad request error if the group id is missing', async () => {
      mockReq = {
        params: {},
        body: { name: 'Updated Group', permissions: ['read', 'write'] },
      };

      await controller.updateGroup(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message:
          'GroupService Error while updateEntity Error: WHERE parameter "id" has invalid "undefined" value',
      });
    });
  });

  describe('deleteGroupById', () => {
    it('should delete the group and return success message', async () => {
      GroupService.deleteEntity = jest.fn(() => Promise.resolve());

      const mockReq = { params: { id: '123' } };

      await controller.deleteGroupById(mockReq, mockRes);

      expect(GroupService.deleteEntity).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Group is successfully deleted' });
    });
  });
});

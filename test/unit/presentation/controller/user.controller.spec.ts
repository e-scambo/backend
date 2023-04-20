import { mock } from 'sinon';
import { UserController } from '../../../../src/presentation/controller/user.controller';
import { DatabaseMock } from '../../../mock/database.mock';
import { UserMock } from '../../../mock/user.mock';

describe('UserController', () => {
  let service: any;
  let controller: UserController;

  beforeAll(() => {
    service = mock();
    controller = new UserController(service);
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created user', async () => {
        service.create = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await controller.create(UserMock.request);
        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.create = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.create(UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when findById is successful', () => {
      it('should return the fonded user', async () => {
        service.findById = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await controller.findById({
          user_id: UserMock.response._id,
        });
        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.findById = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.findById({
            user_id: UserMock.response._id,
          });
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('updateById()', () => {
    describe('when updateById is successful', () => {
      it('should return the updated user', async () => {
        service.updateById = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await controller.updateById(
          {
            user_id: UserMock.response._id,
          },
          UserMock.request,
        );
        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.updateById = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.updateById(
            {
              user_id: UserMock.response._id,
            },
            UserMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('deleteById()', () => {
    describe('when deleteById is successful', () => {
      it('should return the user found', async () => {
        service.deleteById = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await controller.deleteById({
          user_id: UserMock.response._id,
        });
        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.deleteById = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.deleteById({
            user_id: UserMock.response._id,
          });
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('updatePassword()', () => {
    describe('when updatePassword is successful', () => {
      it('should return undefined', async () => {
        service.updatePassword = jest.fn().mockResolvedValueOnce(undefined);

        const result = await controller.updatePassword(
          { user_id: UserMock.response._id },
          UserMock.updatePasswordRequest,
        );

        expect(result).toBeUndefined();
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.updatePassword = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.updatePassword(
            { user_id: UserMock.response._id },
            UserMock.updatePasswordRequest,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('sendRecoveryLink()', () => {
    describe('when sendRecoveryLink is successful', () => {
      it('should return undefined', async () => {
        service.sendRecoveryLink = jest.fn().mockResolvedValueOnce(undefined);

        const result = await controller.sendRecoveryLink(
          { user_id: UserMock.response._id },
          { email: UserMock.response.email },
        );

        expect(result).toBeUndefined();
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.sendRecoveryLink = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.sendRecoveryLink(
            { user_id: UserMock.response._id },
            { email: UserMock.response.email },
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('redefinePassword()', () => {
    describe('when redefinePassword is successful', () => {
      it('should return undefined', async () => {
        service.redefinePassword = jest.fn().mockResolvedValueOnce(undefined);

        const result = await controller.redefinePassword(
          {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaXJqb2FuZGVyc29ud2ZAZ21haWwuY29tIiwiaWF0IjoxNjgxOTE2Nzk5LCJleHAiOjE2ODI1MjE1OTl9.q6TbxRC-bi_bKDHZXTPMWML_PLYZ_HaD2qwiTTBG-KU',
          },
          { password: UserMock.response.password },
        );

        expect(result).toBeUndefined();
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.redefinePassword = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.redefinePassword(
            {
              token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaXJqb2FuZGVyc29ud2ZAZ21haWwuY29tIiwiaWF0IjoxNjgxOTE2Nzk5LCJleHAiOjE2ODI1MjE1OTl9.q6TbxRC-bi_bKDHZXTPMWML_PLYZ_HaD2qwiTTBG-KU',
            },
            { password: UserMock.response.password },
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});

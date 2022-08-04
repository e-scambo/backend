import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getId, getStr } from 'json-generator';
import { mock } from 'sinon';
import { UserService } from '../../../../src/business/service/user.service';
import { PasswordUtil } from '../../../../src/business/util/password.util';
import { DatabaseMock } from '../../../mock/database.mock';
import { UserMock } from '../../../mock/user.mock';

describe('UserService', () => {
  let repository: any;
  let service: UserService;

  beforeAll(() => {
    repository = mock();
    service = new UserService(repository);
  });

  describe('create()', () => {
    describe('When creates is successful', () => {
      it('should return created user successfully', async () => {
        repository.checkExists = jest.fn().mockResolvedValueOnce(false);
        repository.create = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await service.create(UserMock.request);

        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('When an user already exists with the same unique fields', () => {
      it('should not create and throw an exception ', async () => {
        repository.checkExists = jest.fn().mockResolvedValueOnce(true);
        const exception = new BadRequestException(
          'An user with this email or phone already exists.',
        );

        try {
          await service.create(UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });

    describe('When an unknow database error occurs', () => {
      it('should not create and throw an exception by checkExists ', async () => {
        repository.checkExists = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.create(UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });

      it('should not create and throw an exception by create() ', async () => {
        repository.checkExists = jest.fn().mockResolvedValueOnce(false);
        repository.create = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.create(UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when finds an user', () => {
      it(`should return user's info`, async () => {
        repository.findOne = jest.fn().mockResolvedValueOnce(UserMock.response);

        const result = await service.findById(getId('objectId'));

        expect(result).toMatchObject(UserMock.response);
      });
    });

    describe('when user is not found', () => {
      it('should throw an not fountd exception', async () => {
        const exception = new NotFoundException(
          'User not found or already removed.',
        );
        repository.findOne = jest.fn().mockResolvedValueOnce(undefined);

        try {
          await service.findById(getId('objectId'));
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });

    describe('When an unknow database error occurs', () => {
      it('should throw a database error', async () => {
        repository.findOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.findById(getId('objectId'));
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('updateById()', () => {
    describe('When an update occurrs successfully', () => {
      it(`should update user's infos`, async () => {
        repository.updateOne = jest
          .fn()
          .mockResolvedValueOnce(UserMock.response);

        const result = await service.updateById(
          getId('objectId'),
          UserMock.request,
        );

        expect(result).toMatchObject(result);
      });
    });

    describe('When user is not found', () => {
      it('should return not found exception', async () => {
        const exception = new NotFoundException(
          'User not found or already removed.',
        );
        repository.updateOne = jest.fn().mockResolvedValueOnce(undefined);

        try {
          await service.updateById(getId('objectId'), UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });

    describe('When email or phone is not unique', () => {
      it('should throw an BadRequestException', async () => {
        const exception = new BadRequestException(
          'An user with this email or phone already exists.',
        );
        repository.checkExists = jest.fn().mockResolvedValueOnce(true);

        try {
          await service.updateById(getId('objectId'), UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });

    describe('When an unknow error occurs in database', () => {
      it('should throw a database error', async () => {
        repository.updateOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.updateById(getId('objectId'), UserMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('deleteById()', () => {
    describe('when deleting an user by id', () => {
      it('should delete an user successfully', async () => {
        repository.deleteOne = jest
          .fn()
          .mockResolvedValueOnce(UserMock.response);

        try {
          await service.deleteById(getId('objectId'));
        } catch (err) {
          expect(err).toBeNull();
        }
      });
    });

    describe('When user is not found', () => {
      it('should throw not found exception', async () => {
        const exception = new NotFoundException(
          'User not found or already removed.',
        );
        repository.updateOne = jest.fn().mockResolvedValueOnce(undefined);

        try {
          await service.deleteById(getId('objectId'));
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });
  });

  describe('updatePassword()', () => {
    describe('When update password is successful', () => {
      it(`should update user's password`, async () => {
        const newPassword = getStr(10, 'UTF-8');
        const oldPassword = PasswordUtil.encrypt(UserMock.response.password);

        const { ...rest } = UserMock.response;

        repository.findOne = jest
          .fn()
          .mockResolvedValueOnce({ ...rest, password: oldPassword });

        repository.updateOne = jest
          .fn()
          .mockResolvedValueOnce({ ...rest, password: newPassword });

        const request = {
          current_password: UserMock.request.password,
          new_password: newPassword,
        };

        try {
          await service.updatePassword(getId('objectId'), request);
        } catch (err) {
          expect(err).toBeNull();
        }
      });
    });

    describe('When current password is wrong', () => {
      it('should throw forbidden exception', async () => {
        const exception = new ForbiddenException(
          'The password informed does not match with current password.',
        );

        const newPassword = getStr(10, 'UTF-8');
        const oldPassword = getStr(10, 'UTF-8');

        const { ...rest } = UserMock.response;

        repository.findOne = jest
          .fn()
          .mockResolvedValueOnce({ ...rest, password: oldPassword });

        repository.updateOne = jest
          .fn()
          .mockResolvedValueOnce({ ...rest, password: newPassword });

        const request = {
          current_password: UserMock.request.password,
          new_password: newPassword,
        };

        try {
          await service.updatePassword(getId('objectId'), request);
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });

    describe('When user is not found', () => {
      it('should throw not found exception', async () => {
        const exception = new NotFoundException(
          'User not found or already removed.',
        );

        const newPassword = getStr(10, 'UTF-8');

        const { ...rest } = UserMock.response;

        repository.findOne = jest.fn().mockResolvedValueOnce(undefined);

        repository.updateOne = jest
          .fn()
          .mockResolvedValueOnce({ ...rest, password: newPassword });

        const request = {
          current_password: UserMock.request.password,
          new_password: newPassword,
        };

        try {
          await service.updatePassword(getId('objectId'), request);
        } catch (err) {
          expect(err).toMatchObject(exception);
        }
      });
    });
  });
});

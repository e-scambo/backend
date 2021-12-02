import { NotFoundException } from '@nestjs/common';
import { mock } from 'sinon';
import { ImageService } from '../../../../src/business/service/image.service';
import { DatabaseMock } from '../../../mock/database.mock';
import { ImageMock } from '../../../mock/image.mock';

describe('ImageService', () => {
  let repository: any;
  let service: ImageService;

  beforeAll(() => {
    repository = mock();
    service = new ImageService(repository, repository);
  });

  describe('findByName()', () => {
    describe('when findByName is successful', () => {
      it('should return the founded image', async () => {
        repository.findOne = jest
          .fn()
          .mockResolvedValueOnce(ImageMock.response);

        const result = await service.findByName(
          ImageMock.response.originalname,
        );
        expect(result).toMatchObject(ImageMock.response);
      });
    });

    describe('when image is not founded', () => {
      it('should throw an error', async () => {
        repository.findOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.findByName(ImageMock.response.originalname);
        } catch (err) {
          expect(err).toMatchObject(
            new NotFoundException('Image not found or already removed.'),
          );
        }
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        repository.findOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.findByName(ImageMock.response.originalname);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});

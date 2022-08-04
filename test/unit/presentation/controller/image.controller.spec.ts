import { mock } from 'sinon';
import { ImageController } from '../../../../src/presentation/controller/image.controller';
import { ImageMock } from '../../../mock/image.mock';
import { ExpressMock } from '../../../mock/express.mock';
import { DatabaseMock } from '../../../mock/database.mock';

describe('ImageController', () => {
  let service: any;
  let controller: ImageController;

  beforeAll(() => {
    service = mock();
    controller = new ImageController(service);
  });

  describe('downloadImage', () => {
    describe('when downloadImage is successful', () => {
      it('should stream the image and return undefined', async () => {
        service.findByName = jest
          .fn()
          .mockResolvedValueOnce(ImageMock.response);

        const result = await controller.downloadImage(
          { name: ImageMock.response.originalname },
          ExpressMock.response,
        );
        expect(result).toBeUndefined();
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.findByName = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.downloadImage(
            { name: ImageMock.response.originalname },
            ExpressMock.response,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});

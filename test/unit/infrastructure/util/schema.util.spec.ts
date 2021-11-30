import { SchemaUtil } from '../../../../src/infrastructure/util/schema.util';

describe('SchemaUtil', () => {
  describe('options()', () => {
    it('should return schema options', () => {
      expect(SchemaUtil.options).toBeDefined();
    });

    describe('transform()', () => {
      it('should return the document edited', () => {
        const doc = { _id: 123 };
        const result = SchemaUtil.options.toObject.transform({}, doc);
        expect(result).toMatchObject({ id: 123 });
      });
    });
  });
});

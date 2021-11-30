import { PasswordUtil } from '../../../../../src/business/util/password.util';

describe('PasswordUtil', () => {
  describe('encrypt()', () => {
    describe('when encrypt is successful', () => {
      it('should return the encrypted password', () => {
        const result = PasswordUtil.encrypt('p4ssw0rd');
        expect(result).toBeDefined();
      });
    });

    describe('when password is empty', () => {
      it('should return undefined', () => {
        const result = PasswordUtil.encrypt('');
        expect(result).toBeUndefined();
      });
    });

    describe('when password is null', () => {
      it('should return undefined', () => {
        const result = PasswordUtil.encrypt(null);
        expect(result).toBeUndefined();
      });
    });

    describe('when password is undefined', () => {
      it('should return undefined', () => {
        const result = PasswordUtil.encrypt(undefined);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('isSamePassword()', () => {
    describe('when the password and encrypted password are the same', () => {
      it('should return true', () => {
        const password = 'p4ssw0rd';
        const encrypted = PasswordUtil.encrypt(password);
        const result = PasswordUtil.isSamePassword(password, encrypted);
        expect(result).toEqual(true);
      });
    });

    describe('when the password and encrypted password are not the same', () => {
      it('should return true', () => {
        const password = 'p4ssw0rd';
        const encrypted = PasswordUtil.encrypt('4n0th3rp4ssw0rd');
        const result = PasswordUtil.isSamePassword(password, encrypted);
        expect(result).toEqual(false);
      });
    });

    describe('when password is empty', () => {
      it('should return false', () => {
        const encrypted = PasswordUtil.encrypt('p4ssw0rd');
        const result = PasswordUtil.isSamePassword('', encrypted);
        expect(result).toEqual(false);
      });
    });

    describe('when password is null', () => {
      it('should return false', () => {
        const encrypted = PasswordUtil.encrypt('p4ssw0rd');
        const result = PasswordUtil.isSamePassword(null, encrypted);
        expect(result).toEqual(false);
      });
    });

    describe('when password is undefined', () => {
      it('should return false', () => {
        const encrypted = PasswordUtil.encrypt('p4ssw0rd');
        const result = PasswordUtil.isSamePassword(undefined, encrypted);
        expect(result).toEqual(false);
      });
    });

    describe('when encrypted is empty', () => {
      it('should return false', () => {
        const result = PasswordUtil.isSamePassword('p4ssw0rd', '');
        expect(result).toEqual(false);
      });
    });

    describe('when encrypted is null', () => {
      it('should return false', () => {
        const result = PasswordUtil.isSamePassword('p4ssw0rd', null);
        expect(result).toEqual(false);
      });
    });

    describe('when encrypted is undefined', () => {
      it('should return false', () => {
        const result = PasswordUtil.isSamePassword('p4ssw0rd', undefined);
        expect(result).toEqual(false);
      });
    });
  });
});

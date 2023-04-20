import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { User, UserDocument } from '../../infrastructure/schema/user.schema';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from '../../presentation/dto/user.dto';
import { PasswordUtil } from '../util/password.util';
import { Jwt_Payload, TokenUtil } from '../util/token.util';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly _repository: UserRepository,
    private readonly _mailService: MailerService,
  ) {}

  async create(item: CreateUserDTO): Promise<User> {
    await this.validateUnique({
      $or: [{ email: item.email }, { phone: item.phone }],
    });
    item.password = PasswordUtil.encrypt(item.password);
    return this._repository.create(item);
  }

  async findById(_id: string): Promise<User> {
    const result: User = await this._repository.findOne({ _id });
    if (!result) {
      throw new NotFoundException('User not found or already removed.');
    }
    return result;
  }

  async updateById(_id: string, item: UpdateUserDTO): Promise<User> {
    // 1. Se for informado o email, verificar se outro usuário já o possui
    const query: FilterQuery<UserDocument> = { $or: [] };
    if (item.email) {
      query.$or.push({ _id: { $ne: _id }, email: item.email });
    }
    // 2. Se for informado o telefone, verificar se outro usuário já o possui
    if (item.phone) {
      query.$or.push({ _id: { $ne: _id }, phone: item.phone });
    }
    if (query.$or.length > 0) {
      await this.validateUnique(query);
    }
    const result: User = await this._repository.updateOne({ _id }, item);
    if (!result) {
      throw new NotFoundException('User not found or already removed.');
    }
    return result;
  }

  async deleteById(_id: string): Promise<void> {
    const result: User = await this._repository.deleteOne({ _id });
    if (!result) {
      throw new NotFoundException('User not found or already removed.');
    }
  }

  async updatePassword(
    _id: string,
    passwords: UpdatePasswordDTO,
  ): Promise<void> {
    // 1. Buscar usuário e verificar se o mesmo existe
    const user: User = await this._repository.findOne({ _id });
    if (!user) {
      throw new NotFoundException('User not found or already removed.');
    }
    // 2. Comparar se a senha atul do usuário é igual a senha atual que foi enviada
    if (
      !PasswordUtil.isSamePassword(passwords.current_password, user.password)
    ) {
      throw new ForbiddenException(
        'The password informed does not match with current password.',
      );
    }
    const password: string = PasswordUtil.encrypt(passwords.new_password);
    await this._repository.updateOne({ _id }, { password });
  }

  async sendRecoveryLink(email: string, _id: string): Promise<void> {
    // 1. Buscar usuário e verificar se o mesmo existe
    const user: User = await this._repository.findOne({
      email: email,
      _id: _id,
    });

    if (!user) {
      throw new NotFoundException('User not found or already removed.');
    }

    const recoveryToken = TokenUtil.generateToken(_id, 0); // gerar token com o id

    const link = `${process.env.CLIENT}/activateaccount/${recoveryToken}`;
    const emailConfig = {
      from: `${process.env.GMAIL_USER}`, // sender address
      to: email, // receiver (use array of string for a list)
      subject: 'Etroka recover password', // Subject line
      html: `
      <h2>Recover Password</h2>
      <a href="${link}">
      Click this link to get to recover your password.                              
      </a>

      `,
      text: link,
    };

    this._mailService.sendMail(emailConfig);
  }

  async redefinePassword(token: string, newPassword: string) {
    try {
      const payload = TokenUtil.verifyToken(token, 1) as Jwt_Payload;

      const doesUserExist = await this._repository.checkExists({
        _id: payload._id,
      });
      
      if (!doesUserExist) {
        throw new UnauthorizedException(
          'Invalid credentials. Please try again with valid credentials.',
        );
      }

      const password: string = PasswordUtil.encrypt(newPassword);
      await this._repository.updateOne({ _id: payload._id }, { password });
    } catch (err) {}
  }

  private async validateUnique(filter: FilterQuery<UserDocument>) {
    const exists: boolean = await this._repository.checkExists(filter);
    if (exists) {
      throw new ConflictException(
        'An user with this email or phone already exists.',
      );
    }
  }
}

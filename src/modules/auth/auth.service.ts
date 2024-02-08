import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { RefreshTokensService } from "@/modules/refresh-tokens/refresh-tokens.service";
import { SessionsService } from "@/modules/sessions/sessions.service";
import { UsersService } from "@/modules/users/users.service";

import bycrypt from "bcrypt";
import { type FastifyRequest } from "fastify";

import { MailService } from "../mail/mail.service";
import { AuthRepository } from "./auth.repository";
import { type ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { type SignInDTO } from "./dto/sign-in.dto";
import { type SignOutDTO } from "./dto/sign-out.dto";
import { type SignUpDTO } from "./dto/sign-up.dto";
import { type PayloadWithRefreshTokenType } from "./types/payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly mailService: MailService,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * The `signIn` function is responsible for authenticating a user by checking their email and
   * password, and returning a set of tokens if the authentication is successful.
   * @param {FastifyRequest} req - The `req` parameter is the Fastify request object, which contains
   * information about the incoming HTTP request.
   * @param {SignInDTO} signInDTO - The `signInDTO` parameter is an object that contains the user's
   * email and password. It is used to authenticate the user and verify their credentials.
   * @returns an object with a "data" property that contains the tokens generated during the sign-in
   * process.
   */
  async signIn(req: FastifyRequest, signInDTO: SignInDTO) {
    const user = await this.usersService.get({
      by: "email",
      values: { email: signInDTO.email },
    });

    if (!user?.id) throw new UnauthorizedException();

    const isPasswordMatched = await bycrypt.compare(
      signInDTO.password,
      user.encrypted_password as string,
    );

    if (!isPasswordMatched) throw new UnauthorizedException();

    // assign new refreshTokens to the user's data
    const tokens = await this.authRepository.signInTransaction(req, user);

    return {
      data: tokens,
    };
  }

  /**
   * The signUp function checks if a user with the given email already exists, and if not, creates a
   * new user with the provided details.
   * @param {FastifyRequest} req - The `req` parameter is an object that represents the incoming
   * request. It typically contains information about the HTTP request, such as headers, query
   * parameters, and request body.
   * @param {SignUpDTO} signUpDTO - The `signUpDTO` parameter is an object that contains the data
   * needed to sign up a user. It typically includes properties such as `email`, `firstName`,
   * `lastName`, and `password`. These properties hold the user's email address, first name, last name,
   * and password respectively.
   * @returns an object with a "data" property, which contains the user object.
   */
  async signUp(req: FastifyRequest, signUpDTO: SignUpDTO) {
    const existingUser = await this.usersService.get({
      by: "email",
      values: {
        email: signUpDTO.email,
      },
    });

    if (existingUser) throw new ConflictException();

    const { tokens, user } = await this.authRepository.signUpTransaction(req, {
      email: signUpDTO.email,
      firstName: signUpDTO.firstName,
      lastName: signUpDTO.lastName,
      password: signUpDTO.password,
    });

    this.mailService.send({
      title: "Email Verification",
      subject: "Le-Insight - Email Verification",
      description:
        "Thank you for signing up for Le-Insight. We're excited to have you on board! Before you can start exploring all the features and benefits, we need to verify your email address to ensure the security of your account.",
      label: "Verify Email",
      link: `https://le-insight.vercel.app/auth/reset-password?token="${tokens.confirmationToken}"`,
      from: undefined,
      to: [
        {
          address: `<${user.email}>`,
          name: `${signUpDTO.firstName} ${signUpDTO.lastName}`,
        },
      ],
    });

    return {
      data: {
        user,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
    };
  }

  /**
   * The signOut function removes sessions and tokens from the request.
   * @param {SignOutDTO} signOutDTO - The `signOutDTO` parameter is an object that contains the
   * following properties:
   * @returns an object with a "data" property. The value of the "data" property is the result of
   * calling the "delete" method of the "sessionsService" with the "sessionID" property from the
   * "signOutDTO" object.
   */
  async signOut(signOutDTO: SignOutDTO) {
    // -> remove sessions & token from request
    return {
      data: (
        await this.sessionsService.delete({
          sessionID: signOutDTO.sessionID,
        })
      )[0],
    };
  }

  /**
   * The `refresh` function is used to refresh a user's access and refresh tokens based on a provided
   * refresh token.
   * @param {PayloadWithRefreshTokenType} payload - The `payload` parameter is an object of type
   * `PayloadWithRefreshTokenType`. It contains the following properties:
   * @returns an object with a "data" property that contains the generated tokens.
   */
  async refresh(payload: PayloadWithRefreshTokenType) {
    if (!payload?.rt) throw new UnauthorizedException();

    const user = await this.usersService.get({
      by: "id",
      values: {
        id: payload.sub,
      },
    });

    if (!user) throw new UnauthorizedException("User not found");

    const refreshToken = await this.refreshTokensService.get({
      by: "session_id",
      values: {
        session_id: payload.sid,
      },
    });

    if (!refreshToken?.token)
      return new UnauthorizedException("Session Expired");

    const isRefreshTokenMatch = await bycrypt.compare(
      payload.rt,
      refreshToken.token,
    );

    if (!isRefreshTokenMatch) return new UnauthorizedException();

    const tokens = await this.authRepository.signTokens({
      email: user.email ?? "",
      userID: user.id,
      sessionID: refreshToken.session_id ?? "",
    });

    await this.refreshTokensService.update({
      token: tokens.refreshToken,
      userID: user.id,
      sessionID: refreshToken.session_id ?? "",
    });

    return {
      data: tokens,
    };
  }

  async confirm(confirmEmailDTO: ConfirmEmailDTO) {
    // 1 -> Get the user's email & check if the user's exists
    const user = await this.usersService.get({
      by: "email",
      values: {
        email: confirmEmailDTO.email,
      },
    });

    if (!user?.id) throw new UnauthorizedException();

    // 2 -> Get the hashed token from client's request and verify if the token is valid or not with the db
    if (!user.confirmation_token || !user.confirmation_sent_at)
      throw new UnprocessableEntityException("Invalid Credentials");

    const isTokenMatch = await bycrypt.compare(
      confirmEmailDTO.token,
      user.confirmation_token,
    );

    if (!isTokenMatch) throw new UnauthorizedException();
    // 3 -> Check the expiration date from the database (token created date + 15min < or > now)
    if (Date.now() - user.confirmation_sent_at?.getTime() > 15 * 60 * 1000)
      throw new UnauthorizedException("Invalid Credentials");

    // 4 -> If all passed, update user's email verification
    return {
      data: await this.usersService.update({
        id: user.id,
        confirmation_sent_at: null,
        confirmation_token: null,
        confirmed_at: new Date(),
      }),
    };
  }
}

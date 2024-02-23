import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Public } from "@/common/decorators/public.decorator";
import { User } from "@/common/decorators/user.decorator";

import { MailSerializer } from "@/modules/mail/mail.serializer";
import { SessionsSerializer } from "@/modules/sessions/sessions.serializer";
import { UsersSerializer } from "@/modules/users/users.serializer";

import { FastifyRequest } from "fastify";

import { AuthSerializer } from "./auth.serializer";
import { AuthService } from "./auth.service";
import { ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { RequestConfirmDTO } from "./dto/request-confirm.dto";
import { RequestRecoveryDTO } from "./dto/request-recovery.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { SignInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import {
  type PayloadType,
  PayloadWithRefreshTokenType,
} from "./types/payload.type";

@Controller({ path: "/auth" })
export class AuthController {
  constructor(
    private readonly authSerializer: AuthSerializer,
    private readonly mailSerializer: MailSerializer,
    private readonly sessionsSerializer: SessionsSerializer,
    private readonly usersSerializer: UsersSerializer,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(@Req() req: FastifyRequest, @Body() signUpDTO: SignUpDTO) {
    const data = await this.authService.signUp(req, signUpDTO);
    return this.usersSerializer.serialize(data.user, data.tokens);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Req() req: FastifyRequest, @Body() signInDTO: SignInDTO) {
    const data = await this.authService.signIn(req, signInDTO);
    return this.usersSerializer.serialize(data.user, data.tokens);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-out")
  async signOut(@User() payload: PayloadType) {
    return this.sessionsSerializer.serialize(
      await this.authService.signOut({
        userID: payload.sub,
        sessionID: payload.sid,
      }),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("/refresh")
  async refresh(@User() payload: PayloadWithRefreshTokenType) {
    return this.authSerializer.serialize(
      await this.authService.refresh(payload),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/confirm")
  async confirm(@Body() confirmEmailDTO: ConfirmEmailDTO) {
    return this.usersSerializer.serialize(
      await this.authService.confirmEmail(confirmEmailDTO),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/request-confirm")
  async requestConfirm(@Body() requestConfirmDTO: RequestConfirmDTO) {
    return this.mailSerializer.serialize(
      await this.authService.requestConfirm(requestConfirmDTO),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/recovery-password")
  async recoveryPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.usersSerializer.serialize(
      await this.authService.resetPassword(resetPasswordDTO),
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("/request-recovery")
  async requestRecovery(@Body() requestRecoveryDTO: RequestRecoveryDTO) {
    return this.mailSerializer.serialize(
      await this.authService.requestRecovery(requestRecoveryDTO),
    );
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { AccountModule } from 'src/account/account.module';
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';


@Module({
  imports: [AuthenticatorModule, AccountModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

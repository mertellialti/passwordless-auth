import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { AuthenticatorService } from './authenticator/authenticator.service';
import { AuthenticatorModule } from './authenticator/authenticator.module';

@Module({
  imports: [AuthModule, AccountModule, AuthenticatorModule],
  controllers: [AppController],
  providers: [AppService, AuthenticatorService],
})
export class AppModule {}

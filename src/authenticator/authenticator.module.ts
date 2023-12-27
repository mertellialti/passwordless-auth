import { Module } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';

@Module({    
    providers: [AuthenticatorService],
    // controllers: [AuthController]
    exports: [AuthenticatorService]
  })
export class AuthenticatorModule {}

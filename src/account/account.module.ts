import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
  providers: [AccountService],
  // controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}

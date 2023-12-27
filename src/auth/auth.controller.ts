import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { rpName, rpID, origin } from '../constants';
import { Account } from 'src/account/account';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { AccountService } from 'src/account/account.service';
import { VerifyRegistrationResponse } from 'src/account/requests/verify-registration-response/verify-registration-response';
import { Authenticator } from 'src/authenticator/authenticator';
import { VerifyAuthenticationResponseRequest } from './requests/verify-authentication-response-request/verify-authentication-response-request';
import { CreateAccountRequest } from 'src/account/requests/create/create-account-request';
import { LoginRequest } from 'src/account/requests/login/login-request';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authenticatorSrv: AuthenticatorService,
        private readonly accountSrv: AccountService,
        private readonly authSrv: AuthService
    ) { }

    @Post('register')
    async register(@Body() req: CreateAccountRequest) {
        const result = await this.accountSrv.create(req.account);
        console.log('register: ',result)
        return result;
    }

    @Post('login')
    async login(@Body() req: LoginRequest) {
        const result = await this.accountSrv.getById(req.username);
        console.log('login: ',result)
        return result;
    }

    @Get('generate-registration-options')
    async getRegistrationOptions(@Query('id') id: string) {
        const result = await this.authSrv.generateRegistrationOptions(id);
        console.log('generate registration options: ',result)
        return result;
    }

    @Post('verify-registration-response')
    async verifyRegistrationResponse(@Body() req: VerifyRegistrationResponse) {
        console.log('verify reg res: ', req);
        const result = await this.authSrv.verifyRegistrationResponse(req.userId,req.id, req.rawId, req.response, req.clientExtensionResults);
        console.log('verify-registration-response: ',result)
        return result;
    }

    @Get('get-authentication-options')
    async getAuthenticationOptions(@Query('username') username: string) {
        console.clear();
        console.log('-*- -*- -*- -*-')
        console.log('username: ', username);
        const result = await this.authSrv.getAuthenticationOptions(username);
        console.log('generate-authentication-options: ',result)
        return result;
    }

    @Post('verify-authentication-response')
    async verifyAuthenticationResponse(@Body() req: VerifyAuthenticationResponseRequest) {
        const result = await this.authSrv.verifyAuthenticationResponse(req.username, req.id, req.rawId, req.response, req.clientExtensionResults);
        console.log('verify-authentication-response', result);
        return result;
    }


}


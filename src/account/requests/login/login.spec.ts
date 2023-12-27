import { LoginRequest } from './login-request';

describe('Login', () => {
  it('should be defined', () => {
    expect(new LoginRequest()).toBeDefined();
  });
});

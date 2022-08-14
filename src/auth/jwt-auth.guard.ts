import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const accessToken = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
      }

      const user = this.authService.validateAccessToken(accessToken);
      req.user = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }
  }
}

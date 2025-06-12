import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidUserPropsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpException('invalid fields', 400);
    }
    next();
  }
}

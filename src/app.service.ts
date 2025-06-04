import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getInfo(): string {
    return `
    <ul>
    <li>"/" pagina principal</li>
    <li>"/info" paginas con las dif rutas</li>
    <li>"/users" pagina con los dif usuarios de la app</li>
    </ul>
    `
  }
}

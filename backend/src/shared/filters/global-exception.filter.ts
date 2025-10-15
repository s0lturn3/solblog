/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

/**
 * Filter global adicionado como instruído pelo post: https://chintanonweb.medium.com/mastering-error-handling-in-nest-js-a-comprehensive-guide-54856ef548ec
 * Ainda faltam alguns ajustes
*/
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    
    response.status(status).json({
      statusCode: status,
      message: 'Erro interno de servidor',
    });
  }
}

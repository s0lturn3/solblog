/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        error: false,
        errorMessage: null,
        code: response.statusCode || 200,
        body: data,
        metadata: null
      })),
      catchError((err) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou tente o contato direto pelo email.';

        if (err instanceof HttpException) {
          status = err.getStatus();

          // Many Nest exceptions (like ValidationPipe) store details in `response`
          const responseData: any = err.getResponse();

          // If it's a validation error, keep its messages
          if (responseData && typeof responseData === 'object') {
            message = responseData.message || err.message;
          }
          else {
            message = err.message;
          }
        }

        // 🚀 Important: rethrow, don’t return an empty observable
        return throwError(() =>
          new HttpException({
              error: true,
              errorMessage: message,
              code: status,
              body: null,
              metadata: null,
            },
            status
          )
        );

      })
    );

  }
}

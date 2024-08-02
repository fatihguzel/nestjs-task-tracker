import { LoggerService } from '@nestjs/common';
import 'colors'; // colors kütüphanesini import edin

export class CustomLoggerService implements LoggerService {
  log(message: string) {
    // console.log(message.blue);
  }

  error(message: string, trace: string) {
    console.error(message.red, trace.gray);
  }

  warn(message: string) {
    console.warn(message.yellow);
  }

  debug(message: string) {
    console.debug(message.green);
  }

  verbose(message: string) {
    console.info(message.cyan);
  }
}

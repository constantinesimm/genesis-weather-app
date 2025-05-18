import { Module, DynamicModule, Global } from '@nestjs/common';

import { ApiClientService } from './api-client.service';
import { ApiClientOptions } from './api-client.interface';

@Global()
@Module({})
export class ApiClientModule {
  static forRootAsync(options: {
    imports?: any[];
    useFactory: (
      ...args: any[]
    ) => Promise<ApiClientOptions> | ApiClientOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ApiClientModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'API_CLIENT_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ApiClientService,
      ],
      exports: [ApiClientService],
    };
  }
}

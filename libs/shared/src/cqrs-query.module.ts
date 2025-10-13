import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { Global, Module } from '@nestjs/common';
import { EventDeserializer } from './infrastructure';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: KurrentDBClient,
      useFactory: () => {
        return KurrentDBClient.connectionString(
          'kurrentdb://localhost:2113?tls=false',
        );
      },
    },
    // EventsBridge,
    EventDeserializer,
  ],
  exports: [EventDeserializer],
})
export class CqrsQueryModule {}

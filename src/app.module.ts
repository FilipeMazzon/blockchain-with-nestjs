import { Module } from '@nestjs/common';
import { NetworkModule } from './components/network/network.module';

@Module({
  imports: [NetworkModule],
})
export class AppModule {
}

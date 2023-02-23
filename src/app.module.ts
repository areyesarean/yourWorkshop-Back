import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, `../env/development.env`),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (_configService: ConfigService)=>({
        type: 'postgres',
        host: _configService.get<string>('DATABASE_HOST'),
        port: parseInt(_configService.get<string>('DATABASE_PORT')),
        username: _configService.get<string>('DATABASE_USER'),
        password: _configService.get<string>('DATABASE_PASSWORD'),
        database: _configService.get<string>('DATABASE'),
        entities: [],
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

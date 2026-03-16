import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientModule } from '../client/client.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: parseInt(process.env['DB_PORT'] ?? '5432'),
      username: process.env['DB_USER'] ?? 'postgres',
      password: process.env['DB_PASSWORD'] ?? 'password',
      database: process.env['DB_NAME'] ?? 'semi_app',
      autoLoadEntities: true,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),

    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ClientModule,
    ProjectModule,
    TaskModule,
    DashboardModule,
  ],
})
export class AppModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { JwtMiddleware } from './middlewares/jwt-middeware';
import { CalculatorController } from './controllers/calculator.controller';
import { CalculationService } from './services/calculation.service';
import { RecordService } from './services/record.service';
import { Operation } from './entities/operation.entity';
import { Record } from './entities/record.entity';
import { HttpModule } from '@nestjs/axios';
import { OperationSeeder } from './seed/operation.seeder';
import { CalculationModule } from './calculation/calculation.module';
import { RecordController } from './controllers/record.controller';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Operation, Record]),
    CalculationModule, 
    
  ],
  controllers: [AuthController, CalculatorController, RecordController],
  providers: [AuthService, UserService, JwtService, CalculationService, RecordService, OperationSeeder],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}

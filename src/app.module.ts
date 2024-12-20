import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, TodosModule],
})
export class AppModule {}

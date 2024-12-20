import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './todos.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    try {
      return this.todosService.getTodos();
    } catch (error) {
      throw new HttpException(
        'Error fetching todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createTodo(@Body() request: CreateTodoDto) {
    try {
      return this.todosService.createTodo(request);
    } catch (error) {
      throw new HttpException('Error creating todo', HttpStatus.BAD_REQUEST);
    }
  }
}

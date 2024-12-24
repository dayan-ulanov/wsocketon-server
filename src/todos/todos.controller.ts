import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
    } catch {
      throw new HttpException(
        'Error fetching todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTodoById(@Param('id') todoId: string) {
    try {
      return this.todosService.getTodoById(todoId);
    } catch {
      throw new HttpException(
        'Error fetching todo by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createTodo(@Body() request: CreateTodoDto) {
    try {
      return this.todosService.createTodo(request);
    } catch {
      throw new HttpException('Error creating todo', HttpStatus.BAD_REQUEST);
    }
  }
}

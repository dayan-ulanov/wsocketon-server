import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';

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
      const todo = await this.todosService.getTodoById(todoId);
      if (!todo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      return todo;
    } catch {
      throw new HttpException(
        'Error fetching todo',
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

  @Patch(':id')
  async updateTodo(
    @Param('id') todoId: string,
    @Body() request: UpdateTodoDto,
  ) {
    try {
      const updatedTodo = await this.todosService.updateTodo(todoId, request);
      if (!updatedTodo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      return updatedTodo;
    } catch {
      throw new HttpException('Error updating todo', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    try {
      const deletedTodo = await this.todosService.deleteTodo(id);
      if (!deletedTodo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      return { code: HttpStatus.OK, message: 'Todo successfully deleted' };
    } catch {
      throw new HttpException(
        { code: HttpStatus.BAD_REQUEST, message: 'Error deleting todo' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

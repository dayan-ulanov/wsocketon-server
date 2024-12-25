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
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos(@Query() paginationDto: PaginationDto) {
    try {
      if (paginationDto.query) {
        return await this.todosService.searchByQuery(paginationDto.query);
      }
      return await this.todosService.getTodos(paginationDto);
    } catch (error) {
      throw new HttpException(
        `Error fetching todos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTodoById(@Param('id') todoId: string) {
    try {
      const todo = await this.todosService.getTodoById(todoId);
      if (!todo) {
        throw new HttpException(
          `Todo with ID ${todoId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return todo;
    } catch (error) {
      throw new HttpException(
        `Error fetching todo by ID: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createTodo(@Body() request: CreateTodoDto) {
    try {
      return this.todosService.createTodo(request);
    } catch (error) {
      throw new HttpException(
        `Error creating todo: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
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
        throw new HttpException(
          `Todo with ID ${todoId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedTodo;
    } catch (error) {
      throw new HttpException(
        `Error updating todo: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    try {
      const deletedTodo = await this.todosService.deleteTodo(id);
      if (!deletedTodo) {
        throw new HttpException(
          `Todo with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return { code: HttpStatus.OK, message: 'Todo successfully deleted' };
    } catch (error) {
      throw new HttpException(
        `Error deleting todo: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

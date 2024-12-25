import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './todos.schema';
import { count, eq, sql } from 'drizzle-orm';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class TodosService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getTodos(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    if (limit < 0 || offset < 0) {
      throw new Error('Limit and offset must be non-negative numbers');
    }

    try {
      const todos = await this.database.execute(
        sql`SELECT * FROM ${schema.todos} LIMIT ${limit} OFFSET ${offset}`,
      );

      const parsedTodos = todos.rows || [];

      const totalCountResult = await this.database
        .select({ total: count() })
        .from(schema.todos);

      const total = totalCountResult[0]?.total || 0;

      return {
        data: parsedTodos,
        count: total,
        hasNextPage: offset + parsedTodos.length < total,
      };
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }
  }

  async searchByQuery(query: string) {
    const formattedQuery = `%${query.trim().toLowerCase()}%`;

    try {
      return await this.database
        .select()
        .from(schema.todos)
        .where(
          sql`
          ${schema.todos.title} ILIKE ${formattedQuery}
          OR ${schema.todos.description} ILIKE ${formattedQuery}
        `,
        );
    } catch (error) {
      throw new Error(`Failed to search todos: ${error.message}`);
    }
  }

  async getTodoById(todoId: string) {
    try {
      const todo = await this.database.query.todos.findFirst({
        where: eq(schema.todos.id, todoId),
      });

      if (!todo) {
        throw new Error(`Todo with ID ${todoId} not found`);
      }

      return todo;
    } catch (error) {
      throw new Error(`Failed to get todo by ID: ${error.message}`);
    }
  }

  async createTodo(todo: typeof schema.todos.$inferInsert) {
    try {
      return this.database.insert(schema.todos).values(todo).returning();
    } catch (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }

  async updateTodo(
    todoId: string,
    todo: Partial<typeof schema.todos.$inferInsert>,
  ) {
    try {
      const updatedTodo = await this.database
        .update(schema.todos)
        .set(todo)
        .where(eq(schema.todos.id, todoId))
        .returning();

      if (!updatedTodo) {
        throw new Error(`Todo with ID ${todoId} not found`);
      }

      return updatedTodo;
    } catch (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  async deleteTodo(todoId: string) {
    try {
      const deletedTodo = await this.database
        .delete(schema.todos)
        .where(eq(schema.todos.id, todoId))
        .returning();

      if (!deletedTodo) {
        throw new Error(`Todo with ID ${todoId} not found`);
      }

      return deletedTodo;
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}

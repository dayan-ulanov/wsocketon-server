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
  }

  async getTodoById(todoId: string) {
    return this.database.query.todos.findFirst({
      where: eq(schema.todos.id, todoId),
    });
  }

  async createTodo(todo: typeof schema.todos.$inferInsert) {
    return this.database.insert(schema.todos).values(todo).returning();
  }

  async updateTodo(
    todoId: string,
    todo: Partial<typeof schema.todos.$inferInsert>,
  ) {
    return this.database
      .update(schema.todos)
      .set(todo)
      .where(eq(schema.todos.id, todoId))
      .returning();
  }

  async deleteTodo(todoId: string) {
    return this.database
      .delete(schema.todos)
      .where(eq(schema.todos.id, todoId))
      .returning();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './todos.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TodosService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getTodos() {
    return this.database.query.todos.findMany();
  }

  async getTodoById(todoId: string) {
    return this.database.query.todos.findFirst({
      where: eq(schema.todos.id, todoId),
    });
  }

  async createTodo(todo: typeof schema.todos.$inferInsert) {
    const [createdTodo] = await this.database
      .insert(schema.todos)
      .values(todo)
      .returning();

    return createdTodo;
  }
}

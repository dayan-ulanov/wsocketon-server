import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION, SECRET } from 'src/database/database-connection';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as schema from './auth.schema';

interface SignUpDto {
  email: string;
  password: string;
  username: string;
}

interface SignInDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async signup({ username, email, password }: SignUpDto) {
    const existingUser = await this.database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (existingUser.length > 0) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.database
      .insert(schema.users)
      .values({ email, password: hashedPassword, username })
      .returning();

    return {
      user: newUser[0],
      token: this.generateToken(newUser[0].email, newUser[0].id),
    };
  }

  async signin({ email, password }: SignInDto) {
    const user = await this.database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: user[0],
      token: this.generateToken(user[0].email, user[0].id),
    };
  }

  private generateToken(email: string, id: string): string {
    return jwt.sign({ email, id }, SECRET, { expiresIn: '1h' });
  }
}

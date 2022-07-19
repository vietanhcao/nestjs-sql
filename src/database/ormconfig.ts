import { cwd } from 'process';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import User from 'src/users/user.entity';
import Address from 'src/users/address.entity';
import Category from 'src/categories/category.entity';
import Post from 'src/posts/post.entity';

dotenv.config();
console.log(cwd());

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Post, Address, Category],
  migrations: [cwd() + '/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  dropSchema: false,
});

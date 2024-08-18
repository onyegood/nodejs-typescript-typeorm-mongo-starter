import 'reflect-metadata';
import * as dotenv from 'dotenv';

import { DataSource } from 'typeorm';
import { User } from './database/entity/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  logging: ['query'],
  synchronize: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

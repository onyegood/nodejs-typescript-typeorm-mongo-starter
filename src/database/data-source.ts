import "reflect-metadata";

import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Otp } from "./entity/Otp";
import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  logging: ["query"],
  synchronize: true,
  entities: [User, Otp],
  migrations: ["./migration/*.ts"],
  subscribers: [],
});

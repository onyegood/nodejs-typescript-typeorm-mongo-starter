import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  first_name: string;

  @Column()
  @IsString()
  last_name: string;

  @Column()
  @IsString()
  gender: string;

  @Column({ nullable: true })
  @IsOptional()
  organisationId: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  role: string;

  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @Column({ default: false })
  @IsBoolean()
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { hash } from "bcryptjs";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import {
  BeforeInsert,
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

  @Column({ default: true })
  @IsBoolean()
  first_login: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }

  toResponse(): Partial<User> {
    const resUser = new User();
    resUser.id = this.id;
    resUser.email = this.email;
    resUser.first_name = this.first_name;
    resUser.last_name = this.last_name;
    resUser.phone = this.phone;
    resUser.role = this.role;
    resUser.verified = this.verified;
    resUser.active = this.active;
    resUser.organisationId = this.organisationId;
    resUser.createdAt = this.createdAt;
    resUser.updatedAt = this.updatedAt;

    return resUser;
  }
}

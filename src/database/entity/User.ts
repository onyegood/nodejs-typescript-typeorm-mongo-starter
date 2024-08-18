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
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  gender: string;

  @Column({ nullable: true, default: 1 })
  organisationId: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  role: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true, nullable: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("otps")
export class Otp {
  @ObjectIdColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  code: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

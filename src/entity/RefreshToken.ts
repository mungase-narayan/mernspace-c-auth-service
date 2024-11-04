import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "refreshTokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @ManyToOne(() => User)
  user: User;

  @UpdateDateColumn()
  updatedAt: number;

  @CreateDateColumn()
  createdAt: number;

  constructor(
    id: number,
    expiresAt: Date,
    user: User,
    updatedAt: number,
    createdAt: number,
  ) {
    this.id = id;
    this.expiresAt = expiresAt;
    this.user = user;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

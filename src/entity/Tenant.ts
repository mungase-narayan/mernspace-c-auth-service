import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "tenants" })
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100 })
  name: string;

  @Column("varchar", { length: 250 })
  address: string;

  @UpdateDateColumn()
  updatedAt: number;

  @CreateDateColumn()
  createdAt: number;

  constructor(
    id: number,
    name: string,
    address: string,
    updatedAt: number,
    createdAt: number,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

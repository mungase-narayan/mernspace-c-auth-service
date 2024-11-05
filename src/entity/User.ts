import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Tenant } from "./Tenant";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    tenant: Tenant,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.tenant = tenant;
  }
}

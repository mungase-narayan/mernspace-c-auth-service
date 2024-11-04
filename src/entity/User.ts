import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  constructor(
    id: number,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    this.id = id;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

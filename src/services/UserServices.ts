import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import createHttpError from "http-errors";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({
    role,
    firstName,
    lastName,
    email,
    password,
  }: UserData): Promise<User> {
    try {
      // Ensure password exists
      if (!password) {
        throw createHttpError(400, "Password is required");
      }

      // Hash the password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      // Create user object
      return await this.userRepository.save({
        role,
        firstName,
        lastName,
        email,
        password: hashPassword,
      });

      // Save the user in the repository
    } catch (err) {
      console.log("Error saving user", err);
      throw createHttpError(500, "Failed to save user in repository");
    }
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findById(id: number) {
    console.log("sub: ", id);
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
}

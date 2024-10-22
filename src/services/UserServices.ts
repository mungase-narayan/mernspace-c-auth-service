import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    //Hash the password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    try {
      return await this.userRepository.save({
        role: Roles.CUSTOMER,
        firstName,
        lastName,
        email,
        password: hashPassword,
      });
    } catch (err) {
      const error = createHttpError(500, "Failed to save user in repository");
      throw error;
    }
  }
}

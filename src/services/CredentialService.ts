import bcrypt from "bcrypt";

export class CredentialService {
  async comparePassword(uasePassword: string, passwordHash: string) {
    return await bcrypt.compare(uasePassword, passwordHash);
  }
}

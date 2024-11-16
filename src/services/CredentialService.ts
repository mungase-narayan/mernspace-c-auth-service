import bcrypt from "bcryptjs";

export class CredentialService {
  async comparePassword(uasePassword: string, passwordHash: string) {
    return await bcrypt.compare(uasePassword, passwordHash);
  }
}

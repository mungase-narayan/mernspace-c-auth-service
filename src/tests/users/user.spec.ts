import { DataSource } from "typeorm";
import request from "supertest";
import createJWKSMock from "mock-jwks";

import { AppDataSource } from "../../config/data-source";
import { User } from "../../entity/User";
import { Roles } from "../../constants";
import app from "../../app";

describe("POST /users", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    try {
      jwks = createJWKSMock("http://localhost:5501");
      connection = await AppDataSource.initialize();
    } catch (error) {
      console.error("Error during Database connection in test", error);
      throw error;
    }
  });

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(async () => {
    jwks.stop();
  });

  afterAll(async () => {
    if (connection) {
      await connection.destroy();
    }
  });

  describe("Given all fields", () => {
    it("should persist the user in the database", async () => {
      const adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });

      // Register user
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
        role: Roles.MANAGER,
        // tenantId: 1,
      };
      // Add token to cookie
      const response = await request(app as any)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(201);
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("Should create a manager user", async () => {
      const adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });

      // Register user
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
        role: Roles.MANAGER,
        // tenantId: 1,
      };
      // Add token to cookie
      const response = await request(app as any)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(201);
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(userData.role);
    });

    it("Should return 403 if non admin user tries to create user", async () => {});
  });
});

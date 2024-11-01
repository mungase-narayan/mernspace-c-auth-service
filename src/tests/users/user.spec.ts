import { DataSource } from "typeorm";
import request from "supertest";
import createJWKSMock from "mock-jwks";

import { AppDataSource } from "../../config/data-source";
import { User } from "../../entity/User";
import { Roles } from "../../constants";
import app from "../../app";

describe("GET /auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    try {
      jwks = createJWKSMock("http://localhost:5501");
      connection = await AppDataSource.initialize();
    } catch (error) {
      console.error("Error during Database connection for test", error);
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
    it("Should return the 200 status code", async () => {
      const accessToken = jwks.token({ sub: "1", role: Roles.CUSTOMER });

      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("Should return the user data", async () => {
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
        role: "customer",
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save(userData);

      //Generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      //Add token to cookie
      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });

    it("should not return the password field", async () => {
      // Register user
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
        role: "customer",
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save(userData);
      // Generate token
      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      // Add token to cookie
      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // Check if user id matches with registered user
      expect(response.body as Record<string, string>).not.toHaveProperty(
        "password",
      );
    });

    it("should return 401 status code if token does not exists", async () => {
      // Register user
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
        role: "customer",
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Add token to cookie
      const response = await request(app as any).get("/auth/self");

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });
});

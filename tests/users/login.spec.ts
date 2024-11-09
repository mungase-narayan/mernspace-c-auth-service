import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../config/data-source";
import app from "../../app";

describe("POST /auth/login", () => {
  let connection: DataSource;
  beforeAll(async () => {
    try {
      connection = await AppDataSource.initialize();
    } catch (error) {
      console.error("Error during Database connection", error);
      throw error;
    }
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    if (connection) {
      await connection.destroy();
    }
  });

  describe("Given all fields", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      const userData = {
        email: "example@gmail.com",
        password: "Mungase1234",
      };

      const user = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
      };

      await request(app as any)
        .post("/auth/register")
        .send(user);

      // Act
      const response = await request(app as any)
        .post("/auth/login")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("Should return the access token and refresh token inside a cookie", async () => {
      // Arrange
      const userData = {
        email: "example@gmail.com",
        password: "Mungase1234",
      };

      const user = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
      };

      await request(app as any)
        .post("/auth/register")
        .send(user);

      // Act
      const response = await request(app as any)
        .post("/auth/login")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
      expect(response.headers["set-cookie"]).toBeTruthy();
    });

    it("Should return the 400 status code if email or password is invalid", async () => {
      // Arrange
      const UserData = {
        email: "narayanmungas@gmail.com",
        password: "invalid",
      };

      const user = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "example@gmail.com",
        password: "Mungase1234",
      };

      await request(app as any)
        .post("/auth/register")
        .send(user);

      // Act
      const response = await request(app as any)
        .post("/auth/login")
        .send(UserData);

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
});

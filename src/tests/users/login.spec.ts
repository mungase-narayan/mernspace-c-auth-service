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
    it("should return the 200 status code", async () => {
      // Arrange
      const userData = {
        email: "narayanmungas03@gmail.com",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/login")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });
  });
});

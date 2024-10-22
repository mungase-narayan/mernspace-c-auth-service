import request from "supertest";
import app from "../../app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { cruncateTable } from "../utils";
import { User } from "../../entity/User";
import { Roles } from "../../constants";

describe("POST /auth/register", () => {
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
      // AAA => 1.Arrange 2.Act 3.Assert

      // Arrange
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("Should persist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "test@example.com",
        password: "password123",
      };

      // Act
      await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = await connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("Should return an id of the created user", async () => {
      // Arrange
      const userData = {
        firstName: "Narayan",
        lastName: "Mungase",
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      expect(response.body).toHaveProperty("id");
    });

    it("Should assign a customer role", async () => {
      // Assert
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "mungase@gmail.com",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = await connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });
  });
  describe("Fields are missing", () => {});
});

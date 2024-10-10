import request from "supertest";
import app from "../../app";

describe("POST /auth/register", () => {
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
      const response = await request(app).post("/auth/register").send(userData);

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
      const response = await request(app).post("/auth/register").send(userData);

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
        confirmPassword: "password123",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
    });
  });
  describe("Fields are missing", () => {});
});

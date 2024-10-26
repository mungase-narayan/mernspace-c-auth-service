import request from "supertest";
import app from "../../app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../config/data-source";
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
      // Arrange
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
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
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
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("Should persist the user in the database", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "mungase@gmail.com",
        password: "Mungase1234",
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
      await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = await connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("Should store the hashed password in the database", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "hariprasadmungase04@gmail.com",
        password: "Mungase1234",
      };

      // Act
      await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = await connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it("Should return 400 status code if email is already exists", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "hariprasadmungase04@gmail.com",
        password: "Mungase1234",
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });

    it("Should return the access roken inside a cookie", async () => {
      // Arrange
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
      interface Headers {
        ["set-cookie"]: string[];
      }

      let accessToken = null;
      let refreshToken = null;
      const cookies =
        (response.headers as unknown as Headers)["set-cookie"] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }
        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      console.log("Access token", accessToken);
      console.log("Refresh token", refreshToken);
      if (accessToken && refreshToken) {
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
      }
    });
  });

  describe("Fields are missing", () => {
    it("Should return 400 status code if email field is missing", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("Should return 400 status code if firstName field is missing", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "",
        lastName: "Mungase",
        email: "mungase@gmail.com",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("Should return 400 status code if lastName field is missing", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "",
        email: "mungase@gmail.com",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("Should return 400 status code if role field is missing", async () => {
      // Arrange
      const userData = {
        role: "",
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
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("Should return 400 status code if password field is missing", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: "mungase@gmail.com",
        password: "",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
  });

  describe("Fields are not in proper format", () => {
    it("Should trim the email field", async () => {
      // Arrange
      const userData = {
        role: "customer",
        firstName: "Narayan",
        lastName: "Mungase",
        email: " narayanmungase@gmail.com  ",
        password: "Mungase1234",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0].email).toBe("narayanmungase@gmail.com");
    });

    //Incomplete test
    it("Should return 400 status code if email is not a valid email", async () => {});

    //Incomplete test
    it("Should return 400 status code if firstName, lastName, or password contain special characters", async () => {});

    //Incomplete test
    it("Should return 400 status code if password length is less than 8 characters", async () => {});
  });
});

import { DataSource } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import request from "supertest";
import app from "../../app";
import { Tenant } from "../../entity/Tenant";

describe("POST /tenants", () => {
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
    it("Should return the 201 status code", async () => {
      // Arrange
      const tenantData = {
        name: "Arnraj Veg Treat",
        address: "Located on Latur Road Bypass in Barshi",
      };

      // Act
      const response = await request(app as any)
        .post("/tenants")
        .send(tenantData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("Should create a tenant in the database", async () => {
      // Arrange
      const tenantData = {
        name: "Arnraj Veg Treat",
        address: "Located on Latur Road Bypass in Barshi",
      };

      // Act
      await request(app as any)
        .post("/tenants")
        .send(tenantData);

      // Assert
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});

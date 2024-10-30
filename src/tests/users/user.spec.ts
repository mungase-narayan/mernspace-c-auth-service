import { DataSource } from "typeorm";
import { AppDataSource } from "../../config/data-source";

describe("GET /auth/self", () => {
  let connection: DataSource;

  beforeAll(async () => {
    try {
      connection = await AppDataSource.initialize();
    } catch (error) {
      console.error("Error during Database connection for test", error);
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
    it("Should return the 200 status code", async () => {
      
    });
  });
});

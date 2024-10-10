import app from "./app";
import { calculateDiscount } from "./config/utils";
import request from "supertest";

describe.skip("App", () => {
  it("should calculate the discount", () => {
    const amount = 100;
    const precentage = 10;
    const discount = calculateDiscount(amount, precentage);
    expect(discount).toBe(10);
  });

  it("should return 200 status code", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});

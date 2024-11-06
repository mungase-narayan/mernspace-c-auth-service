import { Response, NextFunction } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export default class {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    this.logger.debug("Request for creating a new tenant", req.body);

    try {
      const tenant = await this.tenantService.create({ name, address });

      this.logger.info("Tenant has been created successfully", {
        id: tenant.id,
      });
      res
        .status(201)
        .json({ id: tenant.id, message: "Tenant created successfully" });
    } catch (error) {
      next(error);
      return;
    }
  }
}

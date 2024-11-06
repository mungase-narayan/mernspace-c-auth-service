import { Request, Response, NextFunction } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name, address } = req.body;
    this.logger.debug("Request for creating a new tenant", req.body);

    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info("Tenant has been created", { id: tenant.id });

      res.status(201).json({
        id: tenant.id,
        message: "Tenant has been created successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name, address } = req.body;
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    this.logger.debug("Request for updating a tenant", req.body);

    try {
      await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });

      this.logger.info("Tenant has been updated", { id: tenantId });

      res.json({
        id: Number(tenantId),
        message: "Tenant has been updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

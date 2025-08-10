import { Request, Response, NextFunction } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest, TenantQueryParams } from "../types";
import { Logger } from "winston";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class {
  constructor(
    private readonly tenantService: TenantService,
    private readonly logger: Logger,
  ) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name, address } = req.body;
    this.logger.debug({
      msg: "Request for creating a new tenant",
      data: { name: name, address: address },
    });

    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info({
        msg: "Tenant has been created",
        data: { tenantId: tenant.id },
      });

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

    this.logger.debug({
      msg: "Request for updating a tenant",
      data: { tenantId: tenantId },
    });

    try {
      await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });

      this.logger.info({
        msg: "Tenant has been updated",
        data: { tenantId: tenantId },
      });

      res.json({
        id: Number(tenantId),
        message: "Tenant has been updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const validatedQuery = matchedData(req, { onlyValidData: true });
    try {
      const [tenants, count] = await this.tenantService.getAll(
        validatedQuery as TenantQueryParams,
      );

      this.logger.info({ msg: "All tenant have been fetched" });
      res.json({
        currentPage: validatedQuery.currentPage as number,
        perPage: validatedQuery.perPage as number,
        total: count,
        data: tenants,
      });

      res.json(tenants);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      const tenant = await this.tenantService.getById(Number(tenantId));

      if (!tenant) {
        next(createHttpError(400, "Tenant does not exist."));
        return;
      }

      this.logger.info({ msg: "Tenant has been fetched" });
      res.json(tenant);
    } catch (err) {
      next(err);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.params.id;

    if (isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      const tenant = await this.tenantService.findById(Number(tenantId));
      if (!tenant) {
        res.status(404).json({ Error: "Tenant does not exist." });
        next(createHttpError(400, "Tenant does not exist."));
        return;
      }

      await this.tenantService.deleteById(Number(tenantId));

      this.logger.info({
        msg: "Tenant has been deleted",
        data: { tenantId: Number(tenantId) },
      });
      res.json({ id: Number(tenantId), message: "Tenant has been deleted" });
    } catch (err) {
      next(err);
    }
  }
}

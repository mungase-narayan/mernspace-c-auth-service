import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";

import TenantController from "../Controllers/TenantController";
import { TenantService } from "../services/TenantService";

import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";

import logger from "../config/logger";
import { Roles } from "../constants";
import { CreateTenantRequest } from "../types";

import tenantValidator from "../validators/tenant-validator";
import listUsersValidator from "../validators/list-users-validator";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticate as RequestHandler,
  tenantValidator,
  canAccess([Roles.ADMIN]),
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
  "/getList",
  listUsersValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAll(req, res, next) as unknown as RequestHandler,
);

export default router;

import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { ITenant, TenantQueryParams } from "../types";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData);
  }

  async update(id: number, tenantData: ITenant) {
    return await this.tenantRepository.update(id, tenantData);
  }
}

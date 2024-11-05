import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenantTable1730770558232 implements MigrationInterface {
    name = 'CreateTenantTable1730770558232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "address" character varying(250) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1628490866498 implements MigrationInterface {
    name = 'fixUserDetails1628490866498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "detail_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_9fc134ca20766e165ad650ee740" UNIQUE ("detail_id")`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_9fc134ca20766e165ad650ee740" FOREIGN KEY ("detail_id") REFERENCES "users_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_9fc134ca20766e165ad650ee740"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_9fc134ca20766e165ad650ee740"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "detail_id"`);
    }

}

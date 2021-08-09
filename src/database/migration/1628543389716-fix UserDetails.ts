import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1628543389716 implements MigrationInterface {
    name = 'fixUserDetails1628543389716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users_details" DROP CONSTRAINT "UQ_f1ed80376255ce7fd3efa35e007"`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ADD "name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "updated_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ADD "name" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users_details" ADD CONSTRAINT "UQ_f1ed80376255ce7fd3efa35e007" UNIQUE ("name")`);
    }

}

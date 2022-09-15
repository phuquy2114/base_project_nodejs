import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOne2oneTable1627207233238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let scmd =
      'CREATE TABLE `customer_profile` (\
            `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
            `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\
            `favourite` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\
            PRIMARY KEY (`email`)\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);

    scmd =
      'CREATE TABLE `customer` (\
            `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
            `fullname` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
            PRIMARY KEY (`email`),\
            UNIQUE KEY `REL_customer_email` (`email`),\
            CONSTRAINT `FK_customer_customer_profile_email` FOREIGN KEY (`email`) REFERENCES `customer_profile` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customer');
    await queryRunner.dropTable('customer_profile');
  }
}

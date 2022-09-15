import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1623900557910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let scmd =
      'CREATE TABLE `users` (\
      `usr` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
      `pwd` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
      `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
      `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,\
      `role` int(11) NOT NULL,\
      `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\
      `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),\
      PRIMARY KEY (`usr`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);

    scmd = 'INSERT INTO `users` (`usr`,`pwd`,`first_name`,`last_name`,`role`) VALUES ("cus1","123456","customer","one",3);';
    await queryRunner.query(scmd);

    scmd = 'INSERT INTO `users` (`usr`,`pwd`,`first_name`,`last_name`,`role`) VALUES ("cus2","123456","customer","two",3);';
    await queryRunner.query(scmd);

    scmd = 'INSERT INTO `users` (`usr`,`pwd`,`first_name`,`last_name`,`role`) VALUES ("corp","123456","Hybrid","Technologies",2);';
    await queryRunner.query(scmd);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

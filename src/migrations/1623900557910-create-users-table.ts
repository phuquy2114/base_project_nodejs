import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1623900557910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let scmd;

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

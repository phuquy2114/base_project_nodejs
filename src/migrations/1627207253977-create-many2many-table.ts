import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMany2manyTable1627207253977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let scmd =
      'CREATE TABLE `category` (\
            `id` int(11) NOT NULL AUTO_INCREMENT,\
            `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\
            PRIMARY KEY (`id`)\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);

    scmd =
      'CREATE TABLE `question` (\
            `id` int(11) NOT NULL AUTO_INCREMENT,\
            `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\
            `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\
            PRIMARY KEY (`id`)\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);

    scmd =
      'CREATE TABLE `category_question` (\
            `question_id` int(11) NOT NULL,\
            `category_id` int(11) NOT NULL,\
            PRIMARY KEY (`question_id`,`category_id`),\
            KEY `IDX_category_question_question_id` (`question_id`),\
            KEY `IDX_category_question_category_id` (`category_id`),\
            CONSTRAINT `FK_category_question_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,\
            CONSTRAINT `FK_category_question_question_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE\
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    await queryRunner.query(scmd);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('category_question');
    await queryRunner.dropTable('question');
    await queryRunner.dropTable('category');
  }
}

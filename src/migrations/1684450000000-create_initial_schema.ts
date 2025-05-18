import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialPostgresSchema1684450000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Create enum type if it doesn't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'efrequency') THEN
          CREATE TYPE "efrequency" AS ENUM('hourly', 'daily');
        END IF;
      END
      $$;
    `);

    // Create subscriptions table if not exists
    const hasTable = await queryRunner.hasTable('subscriptions');
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'subscriptions',
          comment: 'Weather subscription table',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
              comment: 'Primary key: subscription UUID',
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
              isNullable: false,
              comment: 'Email address to receive weather updates',
            },
            {
              name: 'city',
              type: 'varchar',
              length: '100',
              isNullable: false,
              comment: 'City for weather updates',
            },
            {
              name: 'frequency',
              type: 'efrequency',
              isNullable: false,
              default: `'daily'`,
              comment: 'Frequency of updates: hourly or daily',
            },
            {
              name: 'confirmed',
              type: 'boolean',
              isNullable: false,
              default: false,
              comment: 'Whether the subscription has been confirmed',
            },
            {
              name: 'token',
              type: 'varchar',
              length: '255',
              isNullable: false,
              comment: 'Token for confirmation/unsubscribe operations',
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop subscriptions table if exists
    const hasTable = await queryRunner.hasTable('subscriptions');
    if (hasTable) {
      await queryRunner.dropTable('subscriptions');
    }
    // Drop enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "efrequency";`);
  }
}

import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createUsers1603153042245 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar'
                },
                {
                    name: 'passwordResetToken',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'passwordResetExpires',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    unsigned: true,
                    default: "current_timestamp"
                },
               
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
        
    }

}

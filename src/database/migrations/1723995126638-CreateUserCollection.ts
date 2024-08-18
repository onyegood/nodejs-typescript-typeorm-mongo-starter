import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCollection1723995126638 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userCollection =
      queryRunner.connection.mongoManager.getMongoRepository("User");
    await userCollection.createCollectionIndex({ email: 1 }, { unique: true });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userCollection =
      queryRunner.connection.mongoManager.getMongoRepository("Todo");
    await userCollection.dropCollectionIndex("email");
  }
}

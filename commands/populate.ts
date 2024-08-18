import { UserRepository } from '../src/repositories/UsersRepository';
import { AppDataSource } from '../src/data-source';
import { faker } from '@faker-js/faker';

// const userRepository = AppDataSource.getMongoRepository(User);

AppDataSource.initialize()
  .then(async () => {
    for (let i = 0; i < 10; i++) {
      await UserRepository.save({
        firstName: faker.person.firstName(),
        lastName: faker.person.fullName(),
        gender: faker.person.gender(),
      });
    }

    process.exit();
  })
  .catch((err) => console.error(err));

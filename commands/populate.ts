// import { UserRepository } from '../src/repositories/UsersRepository';
// import { AppDataSource } from '../src/database/data-source';
// import { faker } from '@faker-js/faker';

// AppDataSource.initialize()
//   .then(async () => {
//     for (let i = 0; i < 10; i++) {
//       await UserRepository.save({
//         first_name: faker.person.firstName(),
//         last_name: faker.person.fullName(),
//         gender: faker.person.gender(),
//         organisationId: faker.database.mongodbObjectId(),
//         password: faker.lorem.word(6),
//         phone: faker.phone,
//         role: 'user',
//         verified: false,
//         active: false,
//         createdAt: faker.date.anytime(),
//         updatedAt: faker.date.anytime(),
//       });
//     }

//     process.exit();
//   })
//   .catch((err) => console.error(err));

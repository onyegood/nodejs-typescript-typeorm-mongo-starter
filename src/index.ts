import app from '@/app';
import { AppDataSource } from '@/data-source';

const PORT = process.env.APP_PORT || 8000;

AppDataSource.initialize()
  .then(async () => {
    console.log('Connected to the db.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

const mongoose = require('mongoose');
const app = require('./app');

const DB_HOST = 'mongodb+srv://Kateryna:Bbe9DAzEkdAEaFDM@cluster0.qqnzf5b.mongodb.net/db-contacts?retryWrites=true&w=majority';

mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    console.log('Database connection successful');
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })
const mongoose = require('mongoose');
mongoose.set('debug', true);

const db = 'skillsphere';
const url = 'mongodb://localhost:27017/' + db;


async function main(){
    await mongoose.connect(url);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});
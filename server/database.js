const mongoose = require('mongoose')

async function startDatabase() {
    const url = 'mongodb://127.0.0.1:27017/urna';
    const db = await mongoose.connect(url, {
    	useUnifiedTopology: true,
	useNewUrlParser: true,
    });

    console.log('[ DATABASE RUNNING ]');
}
module.exports.startDatabase=startDatabase;
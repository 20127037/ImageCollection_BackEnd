const express = require('express');
const cors = require('cors');

SERVER = express();
SERVER.listen(3000);
SERVER.use(cors());
SERVER.use(express.json());

const mssql = require('mssql');
const dbConfig = {
	user: 'sa',
	password: 'Lnthuy29012002',
	server: 'localhost',
	database: 'Image_Collection',
	pool: {
		min: 0,
		max: 10,
		idleTimeoutMillis: 30000
	},
	options: {
		trustServerCertificate: true
	}
}
async function DB(command) {
	try {
		await mssql.connect(dbConfig)
		const result = await mssql.query(command)
		return result
	}
	catch (err) {
		throw err
	}
}

SERVER.get('/', (req, res) => {
	console.log('Hello');
	const stt = Math.floor(Math.random(0, 1) * 10 + 1)
	DB(`select * from Images where stt=${stt}`).then(obj => res.send(JSON.stringify(obj.recordset[0])))
})
SERVER.put('/', (req, res) => {
	DB(`update Images set numOfClick=${req.body.numOfClick} where imageURL='${req.body.imageURL}'`)
		.then(res.send(JSON.stringify({ numOfClick: req.body.numOfClick })))
		.catch(error => console.log('Error here!', error))
})
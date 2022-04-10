const express = require('express');
const cors = require('cors');

SERVER = express.Router();
const port = process.env.PORT || 3000;
// SERVER.listen(port, () => console.log('Server is starting on port: ', port));
SERVER.use(cors());
SERVER.use(express.json());

const mssql = require('mssql');
const dbConfig = {
	server: 'lnthuy.database.windows.net',
	user: 'lnthuy29012002',
	password: 'Lnthuy@29012002',
	database: 'Image_Collection',
	port: 1433,
	pool: {
		min: 0,
		max: 10,
		idleTimeoutMillis: 3000
	},
	options: {
		encrypt: true,
		enableArithAbort: true,
		trustServerCertificate: false
	}
}
const pool = new mssql.ConnectionPool(dbConfig);

async function DB(command) {
	try {
		await pool.connect()
		const result = await mssql.query(command)
		return result
	}
	catch (error) {
		console.log('Cannot connect to Azure Server!')
		throw error
	}
}

// SERVER.get('/prompt',(req,res) => {
// 	if(req.query.date === '26/10/2019') {
// 		res.send(JSON.stringify({answer: 'true'}))
// 	}
// 	else res.send(JSON.stringify({answer: 'false'}))
// })
SERVER.get('/', (req, res) => {
	try {
		const stt = Math.floor(Math.random(0, 1) * 10 + 1)
		DB(`select * from Images where stt=${stt}`)
		.then(obj => res.send(JSON.stringify(obj.recordset[0])))
	}
	catch (error) {
		console.log('Cannot fetch data from Azure Database!')
		throw error
	}
})
SERVER.put('/', (req, res) => {
	DB(`update Images set numOfClick=${req.body.numOfClick} where imageURL='${req.body.imageURL}'`)
		.then(res.send(JSON.stringify({ numOfClick: DB(`select numOfClick from Images where imageURL=${req.body.imageURL}`).then(res => res.recordset[0]) })))
		.catch(error => console.log('Error here!', error))
})

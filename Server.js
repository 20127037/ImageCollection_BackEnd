const express = require('express');
const cors = require('cors');

SERVER = express();
const port = process.env.PORT || 3000;
SERVER.listen(port, () => console.log('Server is starting on port: ', port));
SERVER.use(cors());
SERVER.use(express.json());

const mssql = require('mssql');

// const dbConfig = {
// 	server: 'lnthuy.database.windows.net',
// 	user: 'lnthuy29012002',
// 	password: 'Lnthuy@29012002',
// 	database: 'Image_Collection',
// 	pool: {
// 		min: 0,
// 		max: 10,
// 		idleTimeoutMillis: 30000
// 	},
// 	options: {
// 		encrypt: true,
// 		trustServerCertificate: false
// 	}
// }

async function DB(command) {
	try {
		await mssql.connect('Server=tcp:lnthuy.database.windows.net,1433;Initial Catalog=Image_Collection;Persist Security Info=False;User ID=lnthuy29012002;Password=Lnthuy@29012002;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;')
		const result = await mssql.query(command)
		return result
	}
	catch (err) {
		throw err
	}
}

// Handle request

// SERVER.get('/prompt',(req,res) => {
// 	if(req.query.date === '26/10/2019') {
// 		res.send(JSON.stringify({answer: 'true'}))
// 	}
// 	else res.send(JSON.stringify({answer: 'false'}))
// })
SERVER.get('/', (req, res) => {
	const stt = Math.floor(Math.random(0, 1) * 10 + 1)
	DB(`select * from Images where stt=${stt}`).then(obj => res.send(JSON.stringify(obj.recordset[0])))
})
SERVER.put('/', (req, res) => {
	DB(`update Images set numOfClick=${req.body.numOfClick} where imageURL='${req.body.imageURL}'`)
		.then(res.send(JSON.stringify({ numOfClick: DB(`select numOfClick from Images where imageURL=${req.body.imageURL}`).then(res => res.recordset[0]) })))
		.catch(error => console.log('Error here!', error))
})

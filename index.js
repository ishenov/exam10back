const express = require('express');
const cors = require('cors');
const mysql = require('./mysql');
const news = require('./app/news');
const comments = require('./app/comments');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/news', news);
app.use('/comments', comments);

const run = async () => {
	await mysql.connect();
	app.listen(port, () => {
		console.log(`Server started on ${port} port!`);
	});
	process.on('exit', () => {
		mysql.disconnect();
	})
};

run().catch(e => {
	console.error(e);
});

const express = require('express');
const mysql = require('../mysql');
const multer  = require('multer');
const path = require('path');
const config = require('../config');
const nanoid = require('nanoid');



const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, config.uploadPath);
	},
	filename(req, file, cb) {
		cb(null, nanoid() + path.extname(file.originalname));
	}
});
const router = express.Router();
const upload = multer({storage});

router.get('/news', async (req, res) => {
	const news = await mysql.getConnection().query('SELECT `title`, `news_id`, `image`, `datetime` FROM `news`');
	res.send(news);
});

router.get('/news/:id', async (req, res) => {
	const news = await mysql.getConnection().query('SELECT * FROM `news` WHERE `id` = ?', req.params.id);
	if (!news[0]){
		res.send({message : "not found"});
	}
	res.send(news[0]);
});

router.post('/news', upload.single('image'), async (req, res) => {
	const message = req.body;
	if (req.file) {
		message.image = req.file.filename;
	}
	if (message.title && message.newsId && message.content){
		const date = Date.now().toString();
		const result = await mysql.getConnection().query(
			'INSERT INTO `news` (`title`, `news_id`, `image`, `datetime`, `content`) VALUES ' +
			'(?,?,?,?,?)',
			[message.title,message.newsId,message.image,date,message.content]);
		res.send({id : result.insertId,...message});
	}
	res.send({message : "fill all required fields"});
});
router.delete('/news/:id', async (req,res) => {
	try{
		await mysql.getConnection().query(
			'DELETE FROM `news` WHERE `id` = ?',req.params.id
		);
		res.send({message : 'OK'});
	} catch (e) {
		res.send({message : e});
	}
});
module.exports = router;

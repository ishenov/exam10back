const express = require('express');
const mysql = require('../mysql');

const router = express.Router();

router.get('/comments', async (req,res) => {
	const items = await mysql.getConnection().query('SELECT `name`, `id` FROM `categories`');
	res.send(items);
});
// router.get('/:id', async (req,res) => {
// 	const item = await mysql.getConnection().query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id);
// 	if (!item[0]){
// 		res.send({message : "not found"});
// 	}
// 	res.send(item[0]);
// });
router.post('/comments', async (req,res) => {
	const message = req.body;
	if (message.name){
		const result = await mysql.getConnection().query(
			'INSERT INTO `categories` (`name`,`description`) VALUES ' +
			'(?,?)',
			[message.name,message.description]);
		res.send({id : result.insertId,...message});
	}
	res.send({message : "fill all required fields"});
});
router.delete('/comments/:id', async (req,res) => {
	try{
		await mysql.getConnection().query(
			'DELETE FROM `categories` WHERE `id` = ?',req.params.id
		);
		res.send({message : 'OK'});
	} catch (e) {
		res.send({message : e});
	}
});
module.exports = router;

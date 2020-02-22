const express = require('express');
const mysql = require("../mysql");

const router = express.Router();

router.get('/', async (req, res) => {
    const comments = await mysql.getConnection().query('SELECT * FROM `comments`');
    res.send(comments);
});

router.post('/', async (req, res) => {
    const comments = req.body;

    if (comments.comment) {
        const result = await mysql.getConnection().query(
          'INSERT INTO `comments` (`author`,`comment`, `news_id`) VALUES ' +
          '(?,?)',
          [comments.author, comments.comment, comments.news_id]);
        res.send({id: result.insertId, ...comments});
    }
    res.send({message: "fill all required fields"});
});

router.delete('/:id', async (req,res) => {
    try{
        await mysql.getConnection().query(
          'DELETE FROM `comments` WHERE `id` = ?',req.params.id
        );
        res.send({message : 'OK'});
    } catch (e) {
        res.send({message : e});
    }
});
module.exports = router;
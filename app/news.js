const express = require('express');
const nanoid = require('nanoid');
const path = require('path');
const multer = require('multer');
const mysql = require('../mysql');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const router = express.Router();
const upload = multer({storage});

router.get('/', async (req, res) => {
    const news = await mysql.getConnection().query('SELECT * FROM `news`');
    res.send(news);
});

router.get('/:id', async (req, res) => {
    const news = await mysql.getConnection().query('SELECT * FROM `news` WHERE `id` = ?', req.params.id);
    if (!news[0]){
        res.send({message : "not found"});
    }
    res.send(news[0]);
});

router.post('/', upload.single('image'), async (req, res) => {
    const message = req.body;
    if (req.file) {
        message.image = req.file.filename;
    }
    if (message.title && message.content){
        const result = await mysql.getConnection().query(
          'INSERT INTO `news` (`title`,`content`, `image`) VALUES ' +
          '(?,?,?)',
          [message.title,message.content,message.image]);
        res.send({id : result.insertId,...message});
    }
    res.send({message : "fill all required fields"});
});

router.delete('/:id', async (req,res) => {
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
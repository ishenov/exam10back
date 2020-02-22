const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    db : {
        host     : 'localhost',
        user     : 'baha',
        password : '112233',
        database : 'study_db'
    },
};

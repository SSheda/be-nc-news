const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId) => {
    
    return db.query(`SELECT * FROM comments
                     WHERE article_id = $1
                     ORDER BY created_at DESC;`, [articleId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Path not found' })
            }
            return result.rows;
        });
}
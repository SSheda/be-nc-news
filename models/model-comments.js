const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId) => {

    return db.query(`SELECT * FROM comments
                     WHERE article_id = $1
                     ORDER BY created_at DESC;`, [articleId])
        .then(({ rows }) => {
            return rows;
        });
}

exports.insertComment = (articleId, newComment) => {
    const { body, username } = newComment;
    let queryString = "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;"
    const queryValues = [body, username, articleId]
    if (!newComment.body || !newComment.username || Object.keys(newComment).length > 2) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    else {
        return db.query(queryString, queryValues)
            .then(({ rows }) => {
                return rows[0];
            })
    }

}
exports.deleteSingleComment = (comment_id) => {
    return db.query(`DELETE FROM comments
                     WHERE comment_id = $1
                     RETURNING *;`, [comment_id])
        .then(({rows}) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Path not found" });
            }
            return rows;
        });
}

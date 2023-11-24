const db = require("../db/connection")

exports.selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Path not found' })
            }
            return result.rows[0];
        });
}

exports.selectAllArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
                     articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count
                     FROM articles
                     LEFT JOIN comments 
                     ON comments.article_id = articles.article_id
                     GROUP BY articles.article_id
                     ORDER BY articles.created_at DESC;`)
        .then((result) => {
            return result.rows;
        });
}
exports.changeArticleById = (articleId, newVotes) => {
    if (!newVotes.inc_votes ) {
        return Promise.reject({ status: 400, msg: "Bad request" })
    }
    else {
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [newVotes.inc_votes, articleId])
            .then((result) => {
                if (result.rows.length === 0) {
                    return Promise.reject({ status: 404, msg: 'Path not found' })
                }
                return result.rows[0];
            });
    }
}



/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-h_W1Plfpj0TY7wyT2PUPX', content = 'hallo dicoding', owner = 'user-123', threadId = 'thread-h_W1Plfpj0TY7wyT2PUPX', is_delete = false, createdAt = '2023-01-01', updatedAt = '2023-01-01',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, createdAt, updatedAt, is_delete, owner, threadId],
    };

    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;

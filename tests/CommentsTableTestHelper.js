/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    owner = 'user-123',
    thread_id = 'thread-123',
    is_delete = false,
    comment_date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5,$6)',
      values: [id, content, owner, thread_id, is_delete, comment_date],
    };

    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;

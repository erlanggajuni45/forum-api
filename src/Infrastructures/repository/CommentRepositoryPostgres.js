const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;

    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, false, new Date().toISOString()],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment({ ...rows[0] });
  }

  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread yang dituju tidak ditemukan');
    }
  }

  async isCommentExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment yang dituju tidak ditemukan');
    }
  }

  async isOwnerTheComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, commentId],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }

  async isCommentDeleted(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = $2',
      values: [commentId, true],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, users.username
      FROM comments
      JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    console.log(rows);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;

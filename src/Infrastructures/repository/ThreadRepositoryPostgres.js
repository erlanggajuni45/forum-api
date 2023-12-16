const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, date, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  // async getThreadDetail(threadId) {
  //   const query = {
  //     text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username, COUNT(comments.id) AS comment_count
  //     FROM threads
  //     LEFT JOIN comments ON threads.id = comments.thread_id
  //     JOIN users ON threads.owner = users.id
  //     WHERE threads.id = $1
  //     GROUP BY threads.id, users.username`,
  //     values: [threadId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new NotFoundError('thread tidak ditemukan');
  //   }

  //   return result.rows[0];
  // }
}

module.exports = ThreadRepositoryPostgres;

/* eslint-disable no-underscore-dangle */
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComments = require('../../Domains/comments/entities/AddedComments');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(thread, owner, threadId) {
    const { content } = thread;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, false, owner, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComments(result.rows[0]);
  }

  async deleteCommentAtThread(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentAvailable(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak tersedia');
    }
    // else {
    //   return result.rows[0].id;
    // }
  }

  async verifyCommentByOwner(commentId, ownerId) {
    const query = {
      text: 'SELECT * FROM comments WHERE owner = $1 AND id = $2',
      values: [ownerId, commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Tidak memiliki akses');
    }
    // else {
    //   return result.rows[0].id;
    // }
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread = $1 ORDER BY created_at ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;

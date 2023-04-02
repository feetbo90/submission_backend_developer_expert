/* eslint-disable no-underscore-dangle */
const RepliesRepository = require('../../Domains/replies/RepliesRepository');
const AddedReplies = require('../../Domains/replies/entities/AddedReplies');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM replies WHERE comment = $1 ORDER BY created_at ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async addReplies(replies, owner, commentId) {
    const { content } = replies;
    const id = `replies-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    // console.log(`sampai sini${owner} commentId : ${commentId}`);
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, false, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReplies(result.rows[0]);
  }

  async deleteRepliesAtThread(repliesId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [repliesId],
    };
    await this._pool.query(query);
  }

  async verifyReplyAvailable(repliesId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [repliesId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('jawaban tidak tersedia');
    }
  }

  async verifyRepliesByOwner(repliesId, ownerId) {
    const query = {
      text: 'SELECT * FROM replies WHERE owner = $1 AND id = $2',
      values: [ownerId, repliesId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Tidak memiliki akses');
    }
  }
}

module.exports = RepliesRepositoryPostgres;

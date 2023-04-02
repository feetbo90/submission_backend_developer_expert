/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
class CreateThreads {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('CREATE_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 255) {
      throw new Error('CREATE_THREADS.CREATE_THREADS_LIMIT_CHAR');
    }
  }
}

module.exports = CreateThreads;

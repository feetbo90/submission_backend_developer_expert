/* eslint-disable no-underscore-dangle */

class DetailThreadUseCase {
  constructor({
    userRepository, threadRepository, commentRepository, repliesRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);

    const threadPayload = await this._threadRepository.getThreadById(threadId);
    const username = await this._userRepository.getUsernameById(threadPayload.owner);
    const commentsPayload = await this._commentRepository.getCommentsByThreadId(threadId);

    const comments = await Promise.all(commentsPayload.map(async (commentPayload) => {
      const commentOwnerUsername = await this._userRepository.getUsernameById(commentPayload.owner);
      const commentContent = commentPayload.is_delete ? '**komentar telah dihapus**' : commentPayload.content;

      const repliesPayload = await this._repliesRepository.getRepliesByCommentId(commentPayload.id);
      const replies = await Promise.all(repliesPayload.map(async (replyPayload) => {
        const replyOwnerUsername = await this._userRepository.getUsernameById(replyPayload.owner);
        const replyContent = replyPayload.is_delete ? '**balasan telah dihapus**' : replyPayload.content;

        // reply
        return {
          id: replyPayload.id,
          content: replyContent,
          date: replyPayload.created_at,
          username: replyOwnerUsername,
        };
      }));

      // comment
      return {
        id: commentPayload.id,
        username: commentOwnerUsername,
        date: commentPayload.created_at,
        content: commentContent,
        replies,
      };
    }));

    return {
      id: threadPayload.id,
      title: threadPayload.title,
      body: threadPayload.body,
      date: threadPayload.created_at,
      username,
      comments,
    };
  }
}

module.exports = DetailThreadUseCase;

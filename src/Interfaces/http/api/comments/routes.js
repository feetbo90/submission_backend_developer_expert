const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentOnThread,
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentAtThread,
    options: {
      auth: 'forum_jwt',
    },
  },
]);

module.exports = routes;
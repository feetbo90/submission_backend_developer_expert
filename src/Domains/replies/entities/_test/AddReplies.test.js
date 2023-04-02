/* eslint-disable no-undef */
const AddReplies = require('../AddReplies');

describe('a AddReplies entities', () => {
  it('should throw error when payload did not contain needed property comments', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddReplies(payload)).toThrowError('ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddReplies(payload)).toThrowError('ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      content: 'contoh comments di thread',
    };

    // Action
    const { content } = new AddReplies(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});

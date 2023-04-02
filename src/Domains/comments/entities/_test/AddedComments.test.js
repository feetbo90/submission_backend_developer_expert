/* eslint-disable no-undef */
const AddedComments = require('../AddedComments');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property comment', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'abc',
      username: 'iqbal',
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Hallo Dicoding',
      owner: 'abc',
    };

    // Action
    const { id, content, owner } = new AddedComments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});

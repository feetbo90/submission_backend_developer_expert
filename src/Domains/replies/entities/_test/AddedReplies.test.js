/* eslint-disable no-undef */
const AddedReplies = require('../AddedReplies');

describe('a AddedReplies entities', () => {
  it('should throw error when payload did not contain needed property replies', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'abc',
      username: 'user-qwhsh12',
    };

    // Action and Assert
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replies object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Hallo Dicoding',
      owner: 'abc',
    };

    // Action
    const { id, content, owner } = new AddedReplies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});

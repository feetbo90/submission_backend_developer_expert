/* eslint-disable no-undef */
const CreatedThreads = require('../CreatedThreads');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property threads', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'abc',
      username: 'iqbal',
    };

    // Action and Assert
    expect(() => new CreatedThreads(payload)).toThrowError('CREATE_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new CreatedThreads(payload)).toThrowError('CREATE_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      title: 'Hallo Dicoding',
      owner: 'abc',
    };

    // Action
    const { id, title, owner } = new CreatedThreads(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});

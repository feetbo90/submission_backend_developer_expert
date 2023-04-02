/* eslint-disable no-undef */
const CreateThreads = require('../CreateThreads');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property threads', () => {
    // Arrange
    const payload = {
      title: 'abc',
      username: 'iqbal',
    };

    // Action and Assert
    expect(() => new CreateThreads(payload)).toThrowError('CREATE_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new CreateThreads(payload)).toThrowError('CREATE_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload limit char', () => {
    // Arrange
    const payload = {
      title: 'test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title test title',
      body: 'Hallo dicoding',
    };

    // Action and Assert
    expect(() => new CreateThreads(payload)).toThrowError('CREATE_THREADS.CREATE_THREADS_LIMIT_CHAR');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Hallo Dicoding',
    };

    // Action
    const { title, body } = new CreateThreads(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});

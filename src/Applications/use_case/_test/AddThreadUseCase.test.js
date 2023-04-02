/* eslint-disable no-undef */
const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThreads = require('../../../Domains/threads/entities/CreatedThreads');
const CreateThreads = require('../../../Domains/threads/entities/CreateThreads');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread use case', async () => {
    // Arrange
    const useCasePayload = {
      title: 'this is new thread',
      body: 'this is new thread, hallo thread',
    };
    const expectedCreatedThread = new CreatedThreads({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'this is new thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    });
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedCreatedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createThreads = await getThreadUseCase.execute(useCasePayload, 'user-DWrT3pXe1hccYkV1eIAxS');

    // Assert
    expect(createThreads).toStrictEqual(new CreatedThreads({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: useCasePayload.title,
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThreads({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), 'user-DWrT3pXe1hccYkV1eIAxS');
  });
});

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GotComment = require('../../../Domains/comments/entities/GotComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GotThread = require('../../../Domains/threads/entities/GotThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockGotThread = new GotThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'username',
    });

    const mockGotComment = new GotComment({
      id: 'comment-123',
      content: 'comment 1',
      date: new Date().toISOString(),
      username: 'user-123',
      is_delete: false,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGotThread));
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGotComment));

    mockGotThread.comments = [mockGotComment];

    // Action
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(mockGotThread);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});

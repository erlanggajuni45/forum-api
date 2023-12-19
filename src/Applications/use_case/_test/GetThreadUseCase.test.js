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

    const dateFirstComment = new Date().toISOString();
    const dateSecondComment = new Date().toISOString();

    const mockGotThread = new GotThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'username',
    });

    const mockGotCommentFirst = new GotComment({
      id: 'comment-123',
      content: 'comment 1',
      date: dateFirstComment,
      username: 'user-123',
      is_delete: false,
    });

    const mockGotCommentSecond = new GotComment({
      id: 'comment-456',
      content: 'comment 2',
      date: dateSecondComment,
      username: 'user-456',
      is_delete: true,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new GotThread({
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: 'date',
          username: 'username',
        })
      )
    );
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new GotComment({
          id: 'comment-123',
          content: 'comment 1',
          date: dateFirstComment,
          username: 'user-123',
          is_delete: false,
        }),
        new GotComment({
          id: 'comment-456',
          content: 'comment 2',
          date: dateSecondComment,
          username: 'user-456',
          is_delete: true,
        }),
      ])
    );

    mockGotThread.comments = [mockGotCommentFirst, mockGotCommentSecond];

    // Action
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(mockGotThread);
    expect(getThread.comments).toHaveLength(2);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});

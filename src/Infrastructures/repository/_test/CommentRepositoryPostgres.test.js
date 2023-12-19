const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const newComment = {
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const newComment = {
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        })
      );
    });
  });

  describe('isCommentExist function', () => {
    it('should throw error if comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.isCommentExist('comment-123')).rejects.toThrowError(
        NotFoundError
      );
    });

    it('should not throw error if comment is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentExist('comment-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('isOwnerTheComment function', () => {
    it('should throw error if owner is not the comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user 456' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentExist('comment-123')
      ).resolves.not.toThrowError(NotFoundError);

      await expect(
        commentRepositoryPostgres.isOwnerTheComment('comment-123', 'user-456')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error if owner is the comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentExist('comment-123')
      ).resolves.not.toThrowError(NotFoundError);

      await expect(
        commentRepositoryPostgres.isOwnerTheComment('comment-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should return deleted comment correcly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user 123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user 456' });
      await UsersTableTestHelper.addUser({ id: 'user-789', username: 'user 789' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const currentDateFirst = new Date().toISOString();
      const currentDateSecond = new Date().toISOString();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-456',
        threadId: 'thread-123',
        comment_date: currentDateFirst,
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-789',
        threadId: 'thread-123',
        comment_date: currentDateSecond,
        is_delete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      const expectedDateFirst = new Date(comments[0].date).toISOString();
      const expectedDateSecond = new Date(comments[1].date).toISOString();
      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual('user 456');
      expect(comments[0].date).toEqual(expectedDateFirst);
      expect(comments[0].content).toEqual('sebuah comment');
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].username).toEqual('user 789');
      expect(comments[1].date).toEqual(expectedDateSecond);
      expect(comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});

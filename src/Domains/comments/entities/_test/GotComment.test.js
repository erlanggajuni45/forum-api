const GotComment = require('../GotComment');

describe('GotComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and assert
    expect(() => new GotComment(payload)).toThrowError('GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 123,
      username: 123,
      date: 123,
      is_delete: null,
    };

    // Action and assert
    expect(() => new GotComment(payload)).toThrowError(
      'GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should return content correctly when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'user-123',
      date: new Date().toISOString(),
      is_delete: true,
    };

    // Action
    const { content } = new GotComment(payload);

    // Assert
    expect(content).toEqual('**komentar telah dihapus**');
  });

  it('should create GotComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'user-123',
      date: new Date().toISOString(),
      is_delete: false,
    };

    // Action
    const gotComment = new GotComment(payload);

    const { id, content, username, date } = gotComment;

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
  });
});

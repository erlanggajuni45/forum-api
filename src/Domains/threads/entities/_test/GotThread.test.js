const GotThread = require('../GotThread');

describe('GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };

    // Action and assert
    expect(() => new GotThread(payload)).toThrowError('GOT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      body: {},
      date: {},
      username: {},
    };

    // Action and assert
    expect(() => new GotThread(payload)).toThrowError(
      'GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'ini abc',
      date: '2021-08-08T07:22:01.398Z',
      username: 'dicoding',
    };

    // Action
    const { id, title, body, date, username, comments } = new GotThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual([]);
  });
});

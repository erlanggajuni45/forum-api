const GotComment = require('../../Domains/comments/entities/GotComment');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.isThreadExist(threadId);
    const thread = await this._threadRepository.getThreadDetail(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    thread.comments = comments;
    return thread;
  }
}

module.exports = GetThreadUseCase;

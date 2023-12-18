const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.isCommentExist(deleteComment.commentId);
    await this._commentRepository.isOwnerTheComment(deleteComment.commentId, deleteComment.owner);
    await this._commentRepository.deleteComment(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;

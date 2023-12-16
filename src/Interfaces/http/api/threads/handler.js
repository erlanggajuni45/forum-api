const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    if (!request.auth.credentials) {
      throw new AuthenticationError('Kredensial diperlukan untuk menambahkan thread');
    }
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;

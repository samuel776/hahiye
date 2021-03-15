/* eslint-disable class-methods-use-this */

class Respond {
  async error(res, status, message, err = {}) {
    return res.status(status).json({
      success: false,
      status,
      message,
      error: err,
    });
  }

  async success(res, status, data, message) {
    return res.status(status).json({
      success: true,
      status,
      data,
      message,
    });
  }
}

const respond = new Respond();

export default respond;

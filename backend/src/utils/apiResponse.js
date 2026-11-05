class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static paginated(res, message = 'Success', data = [], pagination = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ApiResponse;

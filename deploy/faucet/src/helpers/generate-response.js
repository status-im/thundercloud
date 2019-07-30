function generateErrorResponse (response, err) {
    const out = {
      error: {
        code: err.code || 500,
        title: err.title || 'Error',
        message: err.message || 'Internal server error'
      }
    };
    console.log(err);
    response.send(out);
}

module.exports = { generateErrorResponse };

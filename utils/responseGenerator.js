let responseGenerator = function (error, message, status, token, data, res) {
    let myResponse = {
        error: error,
        message: message,
        status: status,
        token: token,
        data: data,
    };
    if (error) {
        console.log('Response Error message : ', myResponse.message);
        console.log('Response Data : ', myResponse.data);
    } else {
        console.log('Response Data : ', myResponse.message);
    }
    return myResponse;
};

module.exports = responseGenerator;
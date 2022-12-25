const auth = (req, res, next) => {
    const authorization = req.headers.authorization
    const [bearer, token] = authorization.split(" ");
    console.log(bearer, token);
    next()
}

module.exports = auth;
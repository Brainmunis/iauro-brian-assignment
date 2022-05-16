async function authorize(req, res, next){
    const { authtoken } = req.headers;
    if(!authtoken){
        return res.error("UNAUTHENTICATED_USER");
    }
    let [a_err, isValidUser] = await wait(_models.UserToken.authenticate, _models.UserToken, authtoken);
    if(a_err){
        return res.error("UNAUTHENTICATED_USER");
    }
    if(isValidUser){
        let [u_err, user] = await wait(_models.UserToken.getTokenUser, _models.UserToken, isValidUser);
        if(u_err || !user){
            return res.error("UNAUTHENTICATED_USER");
        }
        req.user = user;
        req.user_type = user.user_type
        return next()
    }else{
        return res.error("UNAUTHENTICATED_USER");
    }
}

module.exports = {
  authorize
}

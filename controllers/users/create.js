async function createAdminUser(req, res){
    const body = req.body;

    const [c_err, user] = await wait(
        _models.User._create,
        _models.User,
        body
    );
    if(c_err){
        return res.error(JSON.stringify(c_err))
    }
    return res.success(user);
}

module.exports = createAdminUser;
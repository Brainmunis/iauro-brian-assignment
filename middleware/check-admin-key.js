function isAdminRequest(req, res, next){
    if(req.headers.admin_key === config.ADMIN_KEY){
        return next()
    }else{
        return res.status(403).send(`Unauthorized with admin key ${req.headers.admin_key}`)
    }
}

module.exports = isAdminRequest
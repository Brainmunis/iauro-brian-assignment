const permissions = require('../permissions/user_permission.json');

function checkPermission(permission){
    return function(req, res, next){
        if(
            req.user_type && 
            permissions[req.user_type] && 
            permissions[req.user_type][permission]
        ){
            return next();
        }else{
            return res.error('DONT_HAVE_PERMISSION_TO_PERFORM_CURRENT_ACTION');
        }
    }
}

function getUserPermissions(usertype){
    if(permissions[usertype]){
        return permissions[usertype]
    }else{
        return {}
    }
}

module.exports = {
    can : checkPermission,
    getUserPermissions
}

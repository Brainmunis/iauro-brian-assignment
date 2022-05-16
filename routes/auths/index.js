const admin = require('../../controllers/users')
const validator = require('../../validators/admin-user')
const checkAdminKey = require('../../middleware/check-admin-key')

function authRoutes(router, authorize, can, API_PREFIX) {

    router.get(
        API_PREFIX + "/me",
        authorize,
        admin.getAuthUser
    )

    router.post(
        API_PREFIX + "/first/user/create",
        checkAdminKey,
        validator.createUser,
        admin.createUser
    )
    router.post(
        API_PREFIX + "/user/create",
        authorize,
        can('create-users'),
        validator.createUser,
        admin.createUser
    )

    router.delete(
        API_PREFIX + "/user/:userId/delete",
        authorize,
        can('delete-users'),
        admin.delete
    )

    router.post(
        API_PREFIX + "/user/login",
        admin.login
    )
    router.post(
        API_PREFIX + "/user/register",
        admin.register
    )
}

module.exports = authRoutes;

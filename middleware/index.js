module.exports = {
    authorize : require('../middleware/auth').authorize,
    can : require('../middleware/validatePermission').can,
    setPegination : require('./pagination'),
    isInternalRequest : require('./check-admin-key')
}
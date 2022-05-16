
const { validateString } = require('../form-fields/common/string');
const { validateEmail } = require('../form-fields/common/email');
const { validatePassword } = require('../form-fields/common/password');
const existsRequiredFields = require('../form-fields/common/required_fields')
const _ = require('lodash');

async function createUser(req, res, next){
    const {
        name,
        password,
        email_address,
        user_type,
        phone
    } = req.body;

    const required_fields = ["name", "password", "email_address", "phone", "user_type"]

    let { error, message } = existsRequiredFields(required_fields, req.body);
    if (error) {
      return res.error(message);
    }

    
    const [nerr, nstatus] = validateString(name, "name", 5, 50)
    if(nerr){
        return res.error(nerr);
    }
    const password_error = validatePassword(password);
    if(password_error){
        return res.error(password_error);
    }
    const emalErr = validateEmail(email_address);
    if(emalErr){
        return res.error(emalErr);
    }
    const [pnerr, pnstatus] = validateString(phone, "phone", 8, 14)
    if(pnerr){
        return res.error(pnerr);
    }
    const [uexerr, userExists] = await wait(
        _models.User.findOne,
        _models.User,
        {
            email_address
        }
    )
    if(userExists){
        return res.error(translate("USER_ALREADY_EXISTS"))
    }
    const [au, count] = await wait(
        _models.User.count,
        _models.User,
        {}
    )
   
    if(count >= 1 && user_type === "admin"){
        return res.error(translate('There will be only one admin at the time.'))
    }
    let isRootUser = false;
    const suppUserTypes = config.supported_user_types || ["admin", "normal"];

    if(count === 0){
        isRootUser = true;
    }

    if(!isRootUser && !_.includes(suppUserTypes, user_type)){
        return res.error("INVALID_USER_TYPE")
    }

    return next()
}

module.exports = createUser;
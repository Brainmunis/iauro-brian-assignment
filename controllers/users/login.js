const { validateEmail } = require('../../validators/form-fields/common/email');
const { validatePassword } = require('../../validators/form-fields/common/password');

async function loginUser(req, res){
    const { 
        email_address, 
        password,
        remember_me
    } = req.body;

    const email_error = validateEmail(email_address);
    if(email_error){
        return res.error(email_error);
    }
    const password_error = validatePassword(password);
    if(password_error){
        return res.error(password_error);
    }
    const [l_err, user] = await wait(_models.User.login, _models.User, email_address, password, remember_me);
    if(l_err){
        return res.error(l_err)
    }
    return res.success(
        {
            authtoken : user.authtoken
        }
    );
}


module.exports = loginUser;
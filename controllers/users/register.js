const existsRequiredFields = require('../../validators/form-fields/common/required_fields')
const { validateString } = require('../../validators/form-fields/common/string');
const { validateEmail } = require('../../validators/form-fields/common//email');
const { validatePassword } = require('../../validators/form-fields/common//password');

async function registerUser(req, res){
    const { 
        email_address, 
        password,
        user_type = "normal",
        name,
        phone
    } = req.body;

    
    const required_fields = ["name", "password", "email_address", "phone", "user_type"]

    let { error, message } = existsRequiredFields(required_fields, req.body);
    if (error) {
      return res.error(message);
    }
    const email_error = validateEmail(email_address);
    if(email_error){
        return res.error(email_error);
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
    const password_error = validatePassword(password);
    if(password_error){
        return res.error(password_error);
    }
    const [nameErr, nmstatus] = validateString(name, "name", 2, 14)
    if(nameErr){
        return res.error(nameErr);
    }
    const [pnerr, pnstatus] = validateString(phone, "phone", 10, 14)
    if(pnerr){
        return res.error(pnerr);
    }

    if(user_type !== "normal"){
        return res.error("Invalid user type")
    }

    const [uerr, registerUser] = await wait(
        _models.User._create,
        _models.User,
        {
            email_address,
            name,
            password,
            user_type,
            phone
        }
    )
    if(uerr){
        return res.error("Error while registering user");
    }
    return res.success("User registered successfully");
}

module.exports = registerUser
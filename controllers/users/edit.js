const utils = require('../../helpers/util');

async function editUser(req, res){
    const {
        name,
        password,
        phone,
        userId
    } = req.body;
    const fieldsToUpdate = {};

    const [fuerr, userExists] = await wait(
        _models.User.findOne,
        _models.User,
        {
            uid : userId
        }
    );
    if(fuerr){
        return res.error("SOMETHING_WENT_WRONG.")
    }
    if(!userExists){
        return res.error("Invalid user ID provided.")
    }
    if(userExists.user_type === "admin"){
        return res.error("Cannot change details of admin user")
    }
    if(name){
        const [nameErr, nmstatus] = validateString(name, "name", 8, 14)
        if(nameErr){
            return res.error(nameErr);
        }
        fieldsToUpdate['name'] = name;
    }
    if(password){
        const password_error = validatePassword(password);
        if(password_error){
            return res.error(password_error);
        }
        fieldsToUpdate['password'] = utils.encryptPassword(password);
    }
    if(phone){
        const [pnerr, pnstatus] = validateString(phone, "phone", 8, 14)
        if(pnerr){
            return res.error(pnerr);
        }
        fieldsToUpdate['phone'] = phone;
    }

    if(!Object.keys(fieldsToUpdate).length){
        return res.error("Provide at least one field to update.")
    }

    const [uerr, updatedUser] = await wait(
        _models.User.findOneAndUpdate,
        _models.User,
        {
            uid : userId
        },
        fieldsToUpdate,
        {
            new : true
        }
    )
    if(uerr){
        return res.error("Error while updating user.")
    }
    return res.success(updatedUser);
}

module.exports = editUser;
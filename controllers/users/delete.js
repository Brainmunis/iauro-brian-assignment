async function deleteUser(req, res){
    const {
        userId
    } = req.params;

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
        return res.error("Cannot delete admin user")
    }
    const [duerr, status] = await wait(
        _models.User.remove,
        _models.User,
        {
            uid : userId
        }
    )
    if(duerr){
        return res.error("Error while deleting user.")
    }
    return res.success("User deleted successfully.")
}

module.exports = deleteUser
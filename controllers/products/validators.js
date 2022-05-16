const utils = require('../../helpers/util');
const { validateString } = require('../../validators/form-fields/common/string');
const { validateBoolean } = require('../../validators/form-fields/common/boolean')

async function validateProductFormData(req, res, next){
    const {
        name,
        show,
        description,
        price
    } = req.body;

    const requiredFields = ["name", "show", "price", "description"];

    const result = utils.checkRequiredFields(requiredFields, req.body);

    if(result.error){
        return res.error(result.message);
    }
    const [nerr, nstatus] = validateString(name, "name", 1, 50)
    if(nerr){
        return res.error(nerr);
    }
    const [derr, dstatus] = validateString(description, "description", 5, 1000)
    if(derr){
        return res.error(derr);
    }
    const [serr, sstatus] = validateBoolean(show, "show")
    if(serr){
        return res.error(serr);
    }
    if(typeof price !== 'number' || price > 9999999999){
        return res.error("Invalid price provided.")
    }
    req.product = {
        name,
        description,
        user_type : req.user.user_type,
        show,
        price,
        user_uid : req.user.uid
    }
    return next()
}

async function validateProductFormDataEdit(req, res, next){
    const {
        name,
        show,
        description,
        price
    } = req.body;
    const fieldsToUpdate = {};
    if(name){
        const [nerr, nstatus] = validateString(name, "name", 1, 50)
        if(nerr){
            return res.error(nerr);
        }
        fieldsToUpdate['name'] = name;
    }
    if(req.body.hasOwnProperty("show")){
        const [serr, sstatus] = validateBoolean(show, "show")
        if(serr){
            return res.error(serr);
        }
        fieldsToUpdate['show'] = show;    
    }
    if(description){
        const [derr, dstatus] = validateString(description, "description", 5, 1000)
        if(derr){
            return res.error(derr);
        }
        fieldsToUpdate['description'] = description;    

    }
    if(req.body.hasOwnProperty("price")){
        if(typeof price !== 'number' || price > 9999999999){
            return res.error("Invalid price provided.")
        }
        fieldsToUpdate['price'] = price;    
    }
    if(!Object.keys(fieldsToUpdate).length){
        return res.error("Provide at least one field to update.")
    }
    req.productToUpdate = fieldsToUpdate
    return next()
}


module.exports = {
    validateProductFormData,
    validateProductFormDataEdit
}
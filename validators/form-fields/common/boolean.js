function isBoolean(value, label){
    if(typeof value !== 'boolean'){
        throw translate("INVALID_BOOLEAN_VALUE", { label })
    }
}

function validateBoolean(value, label){
    try{
        isBoolean(value, label)
        return [null, true];
    }catch(e){
        return [e, null]
    }
}
module.exports = {
    validateBoolean
}
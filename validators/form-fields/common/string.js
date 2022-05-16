function isString(str, label){
    if(!str || typeof str !== 'string'){
        throw translate("STRING_REQUIRED", { label })
    }
}

function isMaxString(str, length, label){
    if(!str || str.length > length){
        throw translate("STRING_MAX_LENGTH", { length, label });
    }
}

function isMinString(str, length, label){
    if(!str || str.length < length){
        throw translate("STRING_MIN_LENGTH", { length, label });
    }
}

function validateString(str, label, MinLen, maxLen){
    try{
        isString(str, label)
        isMaxString(str, maxLen, label)
        isMinString(str, MinLen, label)
        return [null, true];
    }catch(e){
        return [e, null]
    }
}
module.exports = {
    validateString
}
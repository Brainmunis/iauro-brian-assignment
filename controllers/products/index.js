module.exports = {
    add : require('./add'),
    list : require('./lists'),
    delete : require('./delete'),
    getById : require('./view'),
    edit : require('./edit'),
    validateProductInput : require('./validators').validateProductFormData,
    validateProductInputEdit : require('./validators').validateProductFormDataEdit
}
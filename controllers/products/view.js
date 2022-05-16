async function getProductById(req, res){
    const user = req.user;
    const {
        productId
    } = req.params;

    const findQuery = {
        uid : productId
    }
    if(user.user_type !== 'admin'){
        findQuery['user_uid'] = user.uid
    }
    const [ferrr, product] = await wait(
        _models.Product.findOne,
        _models.Product,
        findQuery
    )
    if(ferrr){
        return res.error("Something went wrong.")
    }
    return res.success(product)
}

module.exports = getProductById;
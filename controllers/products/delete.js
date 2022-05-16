async function deleteProduct(req, res){
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
    const [ferrr, exists] = await wait(
        _models.Product.findOne,
        _models.Product,
        findQuery
    )
    if(ferrr){
        return res.error("Something went wrong.")
    }
    if(!exists){
        return res.error("Invalid product id provided.")
    }
    const [derr, deleteStatus] = await wait(
        _models.Product._deleteOne,
        _models.Product,
        productId,
        user.uid,
        user.user_type
    );
    if(derr){
        return res.error("Something went wrong.")
    }
    return res.success("Product deleted successfully.")
}

module.exports = deleteProduct;
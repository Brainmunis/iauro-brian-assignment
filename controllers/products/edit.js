async function editProduct(req, res){
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
    if(!product){
        return res.error("Invalid product ID provided.")
    }
    const [uerr, updatedProduct] = await wait(
        _models.Product._updateOne,
        _models.Product,
        productId,
        user.user_type,
        user.uid,
        req.productToUpdate
    )
    if(uerr){
        return res.error("Error while updating product.")
    }
    return res.success(updatedProduct);
}

module.exports = editProduct;
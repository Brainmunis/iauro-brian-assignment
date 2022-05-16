async function addProduct(req, res){
    const product = req.product;

    const [pcerr, createdProduct] = await wait(
        _models.Product._create,
        _models.Product,
        product
    )
    if(pcerr){
        return res.error("Error while creating product.")
    }
    return res.success(createdProduct)
}

module.exports = addProduct;
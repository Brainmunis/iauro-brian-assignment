async function listProducts(req, res){
    
    const user = req.user;
    const {
        name,
        show = true
    } = req.query;

    const [plerr, { items, total}] = await wait(
        _models.Product.lists,
        _models.Product,
        user.uid,
        user.user_type,
        name,
        Boolean(show),
        req.peginationOptions
    )
    if(plerr){
        return res.error("Error while listing products")
    }
    return res.success(req.nextPageOptions(total, items))
}

module.exports = listProducts;
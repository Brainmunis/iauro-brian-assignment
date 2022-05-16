const products = require('../../controllers/products')
const setPagination = require('../../middleware/pagination')

function authRoutes(router, authorize, can, API_PREFIX) {
    router.post(
        API_PREFIX + "/products/add",
        authorize,
        can('create-product'),
        products.validateProductInput,
        products.add
    )
    router.post(
        API_PREFIX + "/products/:productId/edit",
        authorize,
        can('edit-product'),
        products.validateProductInputEdit,
        products.edit
    )
    router.get(
        API_PREFIX + "/products/list",
        authorize,
        can('list-product'),
        setPagination,
        products.list
    )
    router.get(
        API_PREFIX + "/products/:productId/view",
        authorize,
        can('view-product'),
        products.getById
    )
    router.delete(
        API_PREFIX + "/products/:productId/delete",
        authorize,
        can('delete-product'),
        products.delete
    )
    
}

module.exports = authRoutes;

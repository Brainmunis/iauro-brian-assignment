function setPegination(req, res, next){
    const skip = Number(req.query.skip) || config.pagination.DEFAULT_SKIP;
    const limit = Number(req.query.limit) || config.pagination.MAX_LIMIT;
    const current_page = Number(req.query.currentpage) || 1;
    let sortDirection = config.pagination.DEFAULT_SORT_DIRECTION;
    let orderBy = 'created_at';
	if (req.query.sortBy) {
		sortDirection = req.query.sortBy === 'asc' ? 1 : -1;
	}
	if (req.query.orderBy) {
		orderBy = req.query.orderBy;
    }
    req.peginationOptions = {
        skip,
        limit,
        sortDirection,
        orderBy,
        current_page
    }
    req.nextPageOptions = (total, items) => {
        return {
            total,
            items,
            skip,
            limit : limit
        }
    }
    return next();
}

module.exports = setPegination
const advResults = (model) => async(req, res, next) => {
    let query;

    let reqQuery = { ...req.query }

    const removeFromQuery = ['select', 'sort']
        
    removeFromQuery.forEach(param => delete reqQuery[param])

    query = model.find(reqQuery)

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ')
        query = query.sort(fields)
    }
    else {
        query.sort('-name')
    }

    const results = await query

    res.advResults = {
        success: true,
        count: results.length,
        data: results
    }

    next()
}

module.exports = advResults
exports.index_get = (req, res, next) => {
    res.render('index', { 
        title: 'Home',
        user: res.locals.currentUser,
        errors: undefined,
    });
}
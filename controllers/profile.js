const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    //let found = false;
    db.select('*').from('users').where({ id: id })
        .then(user => {
            if (user.length) { //So the way we want to check against the empty array we simply say if user.length exists in that case it will be greater than 1 or equal to 1, will respond with the user.
                res.json(user[0])// because we are receiving an array of objects
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleProfileGet
  }
const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) { // if any of these are empty we can just respond status 400
      return res.status(400).json('incorrect form submission'); //in order to end execution within a function we have to say return. If we don't put the 'return', it will continue the execution.
    }
    const hash = bcrypt.hashSync(password);//bcrypt is going to hash the password 
    db.transaction(trx => { //transactions are these code blocks that we can add to make sure that when we're doing multiple operations on a database if one fails then they all fail. If for some reason, I can't enter something in the users table, but I can in login, as long as it's wrapped around a transaction they both fail so that I never have these inconsistencies.
        trx.insert({ // transaction gets a trx parameter that we can now use instead set of the 'db' to make sure that whatever we do is a transaction. 
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => { // the response is loginEmail(the email column) beacuse in the line above we are returning the email
                return trx('users') //then we use the loginEmail to also return another TRX transaction
                    .returning('*') //here we return all the columns thaht we are inserting. returning is a method of knex.js
                    .insert({
                        // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
                        // loginEmail[0] --> this used to return the email
                        // TO
                        // loginEmail[0].email --> this now returns the email
                        email: loginEmail[0].email, // We use the loginEmail from above after we've updated the login table to update the users table
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]); //because the returning returns an array of objects and when you register a user they should only be one.
                    })
            })
            .then(trx.commit)//at the end because we weren't able to send these because we didn't say that if all these pass then commit, send this transaction through.
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
  };
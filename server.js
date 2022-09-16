const express = require('express');
const bodyParser = require('body-parser'); // Remember when we're sending data from the front-end and it's using JSON, well we need to parse it because Express doesn't know what we just sent over; in order to be able to use 'req.body()' well we need to use body-parser
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    // Enter your own database information here based on what you created
    client: 'pg',
    connection: {
        host: 'postgresql-octagonal-17977', //localhost is the same thing as this number 127.0.0.1
        port: 5432,
        user: 'postgres',// here we enter the passord that we assign in the installation of postgressql
        password: 'test',
        database: 'smart-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => { res.send("it's working!") });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // Register.handleRegister will get the request response so that when register endpoint gets hit it'll receive the request and response and get called with it.
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)}) //remember that if we do it with this syntax [:id] that means we can enter in our browser anything (for example /profile/123) and we'll be able to grab this 'id' (123 in the example) through the 'req.params' property
app.put('/image', (req, res) => { image.handleImage(req, res, db)})//the image endpoint updates the entries and it increases the count.
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)}) //is a post request because we'll add it to our request.body (we will use req.body in image.js, in the const handleApiCall)

/*
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0, //which is what we're going to use to track scores so entries means how many times John has submitted photos for face detection
            joined: new Date() //it will just create a date when this part gets executed.
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0, //which is what we're going to use to track scores so entries means how many times John has submitted photos for face detection
            joined: new Date() //it will just create a date when this part gets executed.
        }
    ]
}
*/

/*
{
   "id": "1"
} with this structure we have to prove in postman the endpoint /image, in 'body' and then click 'send'.
*/

/*
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) { //we'll say that if the user's 'id' matches, in that case we will respond with the 'user.entries' and this 'entries' we want to actually increase.
            found = true;
            user.entries++ // remember thats the short form of me doing plus one and reassigning it.
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})
*/

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
    });

/*
We also want to have a 'signin' route because well we want people to sign in and this 'signin' will most
likely be a POST request because we're posting some data some JSON, some user information, and it's going
to respond with either success or fail.

We also have a 'register' and the register again will be a POST request because we want to add the data
to the database or in our case a variable in our server and with our new user information.
So perhaps this one instead of saying 'success/fail' we will return
the newly created user to make sure that everything is working.
And we will say that this is the new user object that we'll return.

We also want in the homescreen to have an ability to access the profile of the user.
So perhaps we'll have a profile with an optional parameter of 'userId' so that each user has their own
homescreen.
And this will most likely be a GET request.
We just want to get the user information and this will return us the user. 

Perhaps we can have an image endpoint that again will be a post or maybe in our case because we're
updating the score it should be a PUT.
Because the user already exists and we want to make sure that there is an update on the user profile.
And this will just return the updated user object or perhaps whatever we've updated – in our case a
count of some sort.
*/
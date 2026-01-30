const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const upload = require('./config/multerconfig');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.render("index");
})

// dummy route
// app.get('/test', (req, res)=>{
//     res.render("test");
// })

// // upload file
// app.post('/upload', upload.single("image"), (req, res)=>{
//     console.log(req.file);
// })

app.get('/login', (req, res)=>{
    res.render("login");
})

// profile picture 
app.get('/profile/upload', (req, res)=>{
    res.render("profileupload");
})

// profile picture upload
app.post('/upload', isLoggedIn, upload.single("image"), async (req, res)=>{
    let user = await userModel.findOne({email : req.user.email});
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect('/profile');
})

// profile of user
app.get('/profile', isLoggedIn, async (req, res)=>{

    let user = await userModel.findOne({email : req.user.email});
    await user.populate("posts"); // used to populate posts id array to complete post object
    res.render("profile", {user});
})

// like feature
app.get('/like/:id', isLoggedIn, async (req, res)=>{

    let post = await postModel.findOne({_id: req.params.id}).populate("user"); // used to populate user id array to complete user object

    if(post.likes.indexOf(req.user.userId) === -1){ // if user didn't like post before
        post.likes.push(req.user.userId);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userId), 1); // if user already like the post => now he click to unlike(remove his like) the post, so remove its userId from likes array
    }
    await post.save();
    res.redirect('/profile');
})

// edit feature
app.get('/edit/:id', isLoggedIn, async (req, res)=>{

    let post = await postModel.findOne({_id: req.params.id}).populate("user"); // used to populate user id array to complete user object

    res.render("edit", {post});
})

// Delete feature
app.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findOne({ _id: req.params.id });

        // Check if the post exists
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        // Check if the logged-in user is the owner of the post Assuming your 'postModel' has a 'user' field that stores the user's ID and 'req.user.userId' holds the ID of the currently logged-in user.
        if (post.user.toString() !== req.user.userId.toString()) {
            // If the user IDs don't match, send an unauthorized error
            return res.status(403).send("You do not have permission to delete this post.");
        }

        await postModel.deleteOne({ _id: req.params.id });
        res.redirect('/profile');

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("An error occurred while deleting the post.");
    }
});


//update button
app.post('/update/:id', isLoggedIn, async (req, res)=>{

    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content : req.body.content}); // used to populate user id array to complete user object

    res.redirect("/profile");
})

// creating new post
app.post('/post', isLoggedIn, async (req, res)=>{

    let user = await userModel.findOne({email : req.user.email});
    let {content} = req.body;

    let post = await postModel.create({
        user : user._id,
        content : content,
    })

    // saving post id in user posts array
    user.posts.push(post._id);
    await user.save(); // we need to save manually

    res.redirect('/profile');
})

// Register new user
app.post('/register', async(req, res)=>{
    let {username, email, password, name, age} = req.body;

    // checking if user already exist or not
    let user = await userModel.findOne({email : email});

    if(user != null){
        // Render login page with message instead of sending plain text
        return res.render('login', { message: "User already registered, please login." });
    }

    // creating user if not exist 
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
            let user = await userModel.create({
                username : username,
                name : name,
                email : email,
                age : age,
                password : hash,
            })

            let token = jwt.sign({email : email, userId : user._id}, "secretString");

            // sending token as cookie to the browser
            res.cookie("token", token);
            res.redirect("/profile");
        })
    })
})

// validating login user details
app.post('/login', async(req, res)=>{
    let {email, password} = req.body;

    // checking if user exist or not
    let user = await userModel.findOne({email : email});

    if(user == null){
        return res.status(500).send("Something went wrong"); // user not exist - but we dont tell this for security purpose
    }

    // checking password is correct or not 
    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
            let token = jwt.sign({email : email, userId : user._id}, "secretString");
            res.cookie("token", token);
            res.status(200).redirect('/profile');
        }
        else{
            res.redirect("/login");
        }
    })
})

// logout user
app.get('/logout', (req, res)=>{
    res.cookie("token", "");
    res.redirect('/login');
})

// protected middleware
function isLoggedIn(req, res, next){
    if(!req.cookies.token){
        res.redirect("/login");
    }
    else{
        let data = jwt.verify(req.cookies.token, "secretString");
        req.user = data;
        next();
    }
}

app.listen(3000);
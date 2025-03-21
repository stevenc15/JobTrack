//users.js
const express = require('express');
const router = express.Router();
const User = require('../Schemas/userSchema');
const {Op} = require('sequelize'); //operator from sequelize module
const bcrypt = require('bcrypt'); //for password hashing
const saltRounds=10; //how many times password gets hashed
const jwt = require('jsonwebtoken'); //incorporate json webtokens for authentication
const jwtKey = 'EnestaVidaquieroTriunfaryHaceraDiosorgullosoDemi'; //jwt key
const {genToken} = require('./utils/verification'); //generate verification tokens
const {sendVemail} = require('./utils/v_email'); //send verification email
const {sendPchange} = require('./utils/password_change'); //send password change email option
const verifyToken = require ('./utils/jwt'); //create helper function `for jwts

//LOGIN
router.post('/login', async(req, res)=>{

    try{
        const {email, password} = req.body; //email and password required input
        
        //check if email exists
        const user = await User.findOne({
            where: {email:email}
        });

        //no matching email 400
        if(!user){
            return res.status(400).json({message: 'Invalid email Credentials'});
        }

        //check if password is a match, 401 if wrong
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({message: 'Invalid Password'});
        }

        //check for email verification 402
        if (user.isVerified!=true){
            return res.status(402).json({message: 'email verification incomplete'});
        }

        //json webtoken handed given successful login
        const token = jwt.sign({id: user.id}, jwtKey, {expiresIn: '1h'});

        //return token and message
        res.status(200).json({token, userId: user.id, message: 'Logged in successfully'});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Failed Login'})
    }
});

//REGISTER
router.post('/register', async(req, res) => {

    try{
        const {email, password} = req.body; //email password required

        //create email token
        const emailVtoken = genToken();

        //check if email already used 400
        const existingUser = await User.findOne({ 
            where: {
                [Op.or]:[
                    {email}
                ]
            }
        });
        if (existingUser){
            return res.status(400).json({error: 'User already exists'});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create user with email v token
        const user = await User.create({
            email:email,
            password: hashedPassword, 
            emailVtoken: emailVtoken
        });

        //send verification email
        sendVemail(user.email, emailVtoken);

        //success message 200
        res.status(200).json({message: "account successfully created"});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'account creation failed', error});
    }
});

//VERIFY EMAIL
router.post('/verifyEmail', async(req, res) => {
    
    try{
        const {emailVtoken} = req.body; //email verification token needed

        //check if email token is in system 400
        const user = await User.findOne({
            where: {emailVtoken:emailVtoken}
        });
        if(!user){
            return res.status(400).json({message:'incorrect token'});
        }

        //verify user, remove token 200
        user.isVerified=true;
        user.emailVtoken=null;
        await user.save();
        res.status(200).json({message:'successfully verified email'});
    }catch(error){
        res.status(500).send(error);
    }
});

//GET USER scrapped for now


//RESET PASSWORD EMAIL
router.post('/resetPasswordEmail', async(req, res)=>{
    try{
        const {email} = req.body; //email required as input

        //check if email is in system 400
        const user = await User.findOne({
            where: {email:email}
        });
        if (!user){
            return res.status(400).json({message: 'no email matching to any user'});
        }

        //generate password reset token
        const passwordT = genToken();

        //assign password token for verification
        user.passwordVtoken=passwordT;
        await user.save();

        //send password change email with token 200
        sendPchange(user.email, passwordT);
        res.status(200).json({message: 'successfully sent reset token'});
    }catch(error){
        res.status(500).send(error);
    }
});

//PASSWORD RESET CODE 
router.post('/passwordResetCode', async(req, res)=>{
    try{
        const {code} = req.body; //code required for input

        //check if token valid in database 400
        const user = await User.findOne({
            where:{passwordVtoken:code}
        });
        if(!user){
            return res.status(400).json({message: 'code incorrect or no matching code found'});
        }

        //remove token from user 200
        user.passwordVtoken = null;
        await user.save();
        res.status(200).json({message: 'successful input of reset token'});
    }catch(error){
        res.status(500).send(error)
    }   
});

//RESET PASSWORD 
router.post('/resetPassword', async(req, res) =>{

    try{
        const {email, newPassword, confirmPassword} = req.body; //email, new password and confirm new password

        //check if email is valid 400
        const user = await User.findOne({
            where: {email:email}
        });
        if (!user){
            return res.status(400).json({message: 'incorrect email'});
        }

        //check if new password is correctly entered by user 401
        if (newPassword!=confirmPassword){
            return res.status(401).json({message: 'passwords do not match'});
        }

        //check if password is already used 402
        const isMatch = await bcrypt.compare(confirmPassword, user.password);
        if (isMatch){
            return res.status(402).json({message: 'new password cannot match old password'});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        //change user password 200
        user.password=hashedPassword;
        await user.save();
        res.status(200).json({message:'successful change for password'});
    }catch(error){
        res.status(500).send(error);
    }
});

//DELETE ACCOUNT
router.delete('/deleteAccount', verifyToken, async(req, res)=>{
    try{
        //have to add password unhash or something if you want to have password check
        const {email} = req.body;

        //confirm user is selected correctly 400
        const user = await User.findOne({
            where: {email:email}
        });
        if(!user){
            return res.status(400).json({message: 'incorrect email/username'});
        }

        //remove user from database 200
        await user.destroy();
        res.status(200).json({message:"Account deleted"});
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;
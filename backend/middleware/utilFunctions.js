const nodemailer = require("nodemailer");
const crypto = require("crypto");

// function to send verification email to user
const sendVerificationEmail=async(email,verificationToken)=>{

    // create nodemailer  transport
    const transport = nodemailer.createTransport({
        //configure the email service
        service:"gmail",
        auth:{
            user:"pravinkadam201098@gmail.com",
            pass:"rnyt zptn zzfu gell"
        }
    })

    // compose the email message
    const mailOptions={
        from:"amazon.com",
        to:email,
        subject:"Email Verification",
        text:`Please click the following link to verify your email: http://10.104.1.53:8000/register/verify/${verificationToken}`


    }

    //send the email
    try{
await transport.sendMail(mailOptions)
    }catch(error){
        
        console.log("error sending verification email:",error)
    }


}


const generateSecrateKey=()=>{

    const secretKey=crypto.randomBytes(32).toString("hex");
    return secretKey;
}

module.exports = {sendVerificationEmail,generateSecrateKey}
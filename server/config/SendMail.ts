import nodemailer from "nodemailer";

const mailSender=async(email:string,title:string,body:string)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST, 
            secure: true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASSWORD,
            },
        })
        let info = await transporter.sendMail({
            from: `"UrbanPack | Arjun" <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
        })
        console.log(info);
        return info;
    }
    catch(err){
        console.log(err);
        console.error(err);
    }
}

export default mailSender;
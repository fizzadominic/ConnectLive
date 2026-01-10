import  {resendClient, sender}  from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailsTemplates.js";




export const sendWelcomeEmail = async (email , name, clientURL) =>{
    const {data, error} = await resendClient.emails.send({
     from :'onboarding@resend.dev',
     to: email,
     subject : "Welcome to ConnectLive",
     html : createWelcomeEmailTemplate(name,clientURL)
    });

    if(error){
      console.log("Error sending welcom emails", error);
      throw new Error("Failed to send welcome email");
    };

    console.log("Welcome email send successfully ", data);
    
};
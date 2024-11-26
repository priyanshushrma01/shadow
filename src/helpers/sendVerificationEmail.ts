import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Shadow | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
        });
        return {success:true,message:'Verification Email send successfully'}
    } catch (emailerror) {
        console.error("Error sending Verification Email",emailerror)
        return {success:false,message:'Failed to send Verification Email'}
    }
}

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const protectServer=async()=>{
    const session=await auth();
    if(!session){
        redirect("/api/auth/signin");
        // immediately redirects to sign in page after logging out
    }
}
import { UserService } from "../../application/user/userService.js";
import type { IHttpRequest, IHttpResponse } from "../../domain/repositories/IHttpServer.js";
import type { IUserRepository } from "../../domain/repositories/IUserRepostiry.js";
import { ApiError } from "../../shared/errors/ApiError.js";
import { CatchAsync } from "../../shared/errors/catchAsyncFn.js";
import { generateNonce, generateState } from "../../shared/utils/auth/utils.js";

export class UserController {
     UserService:IUserRepository
    constructor() {
        this.UserService = new UserService();
    }
    
   login =  CatchAsync(async (req:IHttpRequest,res:IHttpResponse)=>{
    const{oidcType} = req.params
    if (!oidcType) {
        throw new ApiError(400, "OIDC type is required")
    }
    const state  = generateState();
    const nonce = generateNonce();
    res.cookie("auth_state",state,{httpOnly:true,sameSite:"lax"})
    res.cookie("auth_nonce",nonce,{httpOnly:true,sameSite:"lax"})
    const redirectUrl = this.UserService.login(oidcType,state,nonce)
    res.redirect(redirectUrl)
   })
  
   callback = CatchAsync(async (req:IHttpRequest,res:IHttpResponse)=>{
    const{code,state} = req.query
    const{oidcType} = req.params
    const savedState = req.cookies.auth_state
    const savedNonce = req.cookies.auth_nonce

    if(!savedState || !savedNonce || savedState !== state){
        res.status(400).json(new ApiError(400,"Invalid state or nonce"))
        throw new ApiError(400,"Invalid state or nonce")
    }
    const result = await this.UserService.callback(oidcType as string,code as string,state as string,savedNonce as string,savedState as string)
    if(result.status >= 400){
        res.status(result.status).json(new ApiError(result.status,result.token))
        throw new ApiError(result.status,result.token)
    }
    else{
        res.status(200).json({token:result.token})
    }
   })
}
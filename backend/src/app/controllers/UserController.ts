import type { NextFunction } from "express";
import { UserService } from "../../application/user/userService.js";
import type { IHttpRequest, IHttpResponse } from "../../domain/repositories/IHttpServer.js";
import type { ILoggerRepository } from "../../domain/repositories/IloggerRepositry.js";
import type { IUserRepository } from "../../domain/repositories/IUserRepostiry.js";
import type { ServiceContainer } from "../../infra/di/container.js";
import  { createServiceContainer } from "../../infra/di/container.js";
import { ApiError } from "../../shared/errors/ApiError.js";
import { CatchAsync } from "../../shared/errors/catchAsyncFn.js";
import { generateNonce, generateState } from "../../shared/utils/auth/utils.js";
import jwt from "jsonwebtoken";
import { env } from "../../shared/utils/env/env.js";

export class UserController {
     UserService:IUserRepository
     container:ServiceContainer
     logger:ILoggerRepository
    constructor() {
        this.UserService = new UserService();
        this.container = createServiceContainer();
        this.logger = this.container.logger;
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
  
   callback = CatchAsync(async (req:IHttpRequest,res:IHttpResponse,next:NextFunction)=>{
    const{code,state} = req.query
    const{oidcType} = req.params
    const savedState = req.cookies.auth_state
    const savedNonce = req.cookies.auth_nonce

    if(!savedState || !savedNonce || savedState !== state){
        res.status(400).json(new ApiError(400,"Invalid state or nonce"))
        next(new ApiError(400,"Invalid state or nonce"))
    }
    const result = await this.UserService.callback(oidcType as string,code as string,state as string,savedNonce as string,savedState as string)
   
    this.logger.info("get result of decoded token")
    if(result.status >= 400){
        res.status(result.status).json(new ApiError(result.status,"Error during OIDC callback"))
        next(new ApiError(result.status,"Error during OIDC callback"))
    }
    else{
        const isEnrolled = await this.UserService.findByEmail(result.token.email)
        if(!isEnrolled){
            res.status(404).json(new ApiError(404,"can't able to check enrollment, please try again or sometimes"))
            this.logger.error("can't able to check enrollment, please try again or sometimes")
        }
        if(isEnrolled == false){
            res.status(401).json(new ApiError(401,"You are Unauthorize to access this website"))
            this.logger.error("you are Unauthorize to access this website")
        }
        let user  = await this.UserService.findUser(result.token.sub)
        if(!user){
            user = await this.UserService.create({
                oidcId:result.token.sub,
                email:result.token.email,
                name:result.token.given_name + " " + result.token.family_name,
                isMember:false,
                refreshToken:result.token.refreshToken,
            })
            this.logger.info(`User Created Successfully`)
        }
        else{
            user.refreshToken = result.token.refreshToken
            await this.UserService.update(user)
        }
        const accessToken = jwt.sign(
            {userId: user.id, email:user.email},
            env.JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.cookie("access_token",accessToken,{httpOnly:true,sameSite:"lax"})
        res.status(200).json({message:"Login Successful",accessToken})
        this.logger.info("Login Successful")
    }
   })
}
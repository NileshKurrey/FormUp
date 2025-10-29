// src/domain/http/IHttpTypes.ts

import type { Request,Response,NextFunction } from "express";
export interface IHttpRequest extends Request {}
export interface IHttpResponse extends Response {}
export interface INextFunction extends NextFunction {}
export interface IHttpServer {
  use(path: string, handler: any): void;
  get(path: string, handler: any): void;
  post(path: string, handler: any): void;
  put(path: string, handler: any): void;
  delete(path: string, handler: any): void;
  getAppInstance(): any;
}

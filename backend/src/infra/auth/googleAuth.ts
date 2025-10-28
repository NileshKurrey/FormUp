import type { IAuthRepository } from "../../domain/repositories/IAuthRepositry.ts";
import { env } from "../../shared/utils/env/env.js";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import axios from "axios";



export class GoogleAuth implements IAuthRepository {
  private jwksUri: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.jwksUri = env.JWKs_URI;
    this.clientId = env.GOOGLE_CLIENT_ID;
    this.clientSecret = env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = env.GOOGLE_REDIRECT_URI;
  }

  getJwksClient(){
    return jwksClient({
        jwksUri: this.jwksUri,
        cache: true,
        rateLimit: true,
    });
  }

  async getSigningKey(kid: string | undefined): Promise<string> {
      const client = this.getJwksClient();
      return new Promise((resolve, reject) => {
        client.getSigningKey(kid, (err: any, key: any) => {
          if (err) {
            return reject(err);
          }
            const signingKey = key.getPublicKey();
            resolve(signingKey);
        });
      });
  }

  async verifyToken(token: string): Promise<string> {
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === 'string') {
      throw new Error('Invalid token');
    }
    const kid = decodedHeader.header.kid;
    const signingKey = await this.getSigningKey(kid);
    const verifiedToken:string | jwt.JwtPayload = jwt.verify(token, signingKey, {
        audience: this.clientId,
        algorithms: ['RS256'],
    })
    return verifiedToken as string;
  }


  login(state: string, nonce: string): string {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${this.clientId}` +
          `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
          `&response_type=code` +
          `&scope=openid%20email%20profile` +
          `&state=${state}` +
          `&nonce=${nonce}`;
      return authUrl;
  }

  async handleCallback(code: string, state: string, savedNonce: string, savedState: string): Promise<string> {
        if (state !== savedState) {
            throw new Error('Invalid state parameter');
        }
        // Exchange code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
        });

        const { id_token } = tokenResponse.data;
        // Verify ID token
        const verifiedToken: string  = await this.verifyToken(id_token);
        return verifiedToken;
    }
}
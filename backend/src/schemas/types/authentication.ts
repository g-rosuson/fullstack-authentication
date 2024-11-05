import { Request } from 'express';

export interface IUser {
    id: string;
    email: string;
    password: string;
    refreshToken: string;
}

export type IPartialUser = Omit<IUser, 'password' | 'refreshToken'>;

export type IPartialUserRequest = Request & {
    userData: {
        userId: string;
        email: string;
    }
};

export type ILoginUserRequest = Request & {
    userData: {
        id: string;
        email: string;
    }
};

export type IRegisterUserRequest = Request & {
    credentials: {
        email: string;
        password: string;
    };
};

export type ITokens = Request & {
    tokens: {
        refreshToken: string;
        accessToken: string;
    }
};
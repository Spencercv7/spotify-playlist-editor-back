import { AuthenticationTokens } from "../types/AuthenticationTypes";
import { AccountInfo } from "../types/DataTypes";

import { Account, IAccount, AccountDoc } from "../models/Account";

export const addUser = async (accountInfo: AccountInfo, tokens: AuthenticationTokens): Promise<AccountDoc> => {


    return await Account.build({
		id: accountInfo.id,
		authToken: tokens.authToken,
		refreshToken: tokens.refreshToken,
		expirationTimestamp: tokens.expirationTimestamp,
	}).save();
}

export const getUser = async (id: string): Promise<IAccount> => {
    const res = await Account.find({ id: id });

    return {
        id: res[0].id,
        authToken: res[0].authToken,
        refreshToken: res[0].refreshToken,
        expirationTimestamp: res[0].expirationTimestamp
    };
}

export const updateUserWithUpsert = async (id: string, tokens: AuthenticationTokens): Promise<boolean> => {
    
    const query = {'id': id};
    const entry: IAccount = {
        id: id,
        authToken: tokens.authToken,
        refreshToken: tokens.refreshToken,
        expirationTimestamp: tokens.expirationTimestamp
    }

    const res = await Account.updateOne(query, entry, {upsert: true});

    if (res) return true;
    else return false;

}

export const setAuthTokens = async (id: string, tokens: AuthenticationTokens): Promise<boolean> => {

    const query = {'id': id};
    const updatedEntry: IAccount = {
        id: id,
        authToken: tokens.authToken,
        refreshToken: tokens.refreshToken,
        expirationTimestamp: tokens.expirationTimestamp
    }

    const res = await Account.findOneAndUpdate(query, updatedEntry);

    if (res) return true;
    else return false;
}

export const getAuthTokens = async (id: string) : Promise<AuthenticationTokens> => {
    const user = await getUser(id);

    return {
        authToken: user.authToken,
        refreshToken: user.refreshToken,
        expirationTimestamp: user.expirationTimestamp
    };
}
import { Express, Router } from "express";
import dotenv from "dotenv";
import request from "request";

import { getSpotifyAccountInfo } from "./api/spotifyDataAPI";

// TYPE IMPORTS
import { Request, Response } from "express";
import { ISpotifyAuthRequest } from "./Interfaces/ISpotifyRequest";
import { getSpotifyAuthTokens } from "./api/spotifyAuthAPI";
import { Account } from "./models/Account";

const auth = Router();

const stateKey: string = "spotify_auth_state";

auth.get("/login", (req: Request, res: Response) => {
	const state: string = generateRandomString(16);
	res.cookie(stateKey, state);

	// Initial auth request.
	let scope: string = "user-read-private user-read-email";
	const params: URLSearchParams = new URLSearchParams({
		response_type: "code",
		client_id: process.env.SPOTIFY_CLIENT_ID,
		scope: scope,
		redirect_uri: process.env.REDIRECT_URI,
		state: state,
	});

	res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
});

// Once auth & refresh token acquired....
// 		1. Get account info for DB. (DONE)
//		2. Use account ID for DB key, store refresh and auth token in Mongo.
//		3. Pass spotify ID to front-end and store it in local storage.
//		4. On load of front-end check if id exists in storage.
//      	a. If it does -> attempt to use for pulling data.
// 				I. Use ID to check if auth token in DB associated with ID is still valid.
//					- If is use for requests.
//					- If not use refresh token to generate new auth token.
//			b. If it doesn't -> redirect to login (Return to start of list.)

// Get user ID.
// Check to see if user ID exists in DB.
//		1. If it does, replace current auth and refresh token with new.
//		2. If it doesn't, add new user, store auth and refresh token encrypted.
// 		3. Send in response user ID to be stored in local storage.

auth.post("/token", (req, res) => {

	getSpotifyAuthTokens(req.body.code)
		.then( tokens => {
			if (tokens.authToken === null || tokens.refreshToken === null) {
				res.status(400).send();
				return;
			} else {
				getSpotifyAccountInfo(tokens)
					.then(async accountInfo => {
						await Account.build({
							id: accountInfo.id,
							authToken: tokens.authToken,
							refreshToken: tokens.refreshToken
						}).save()
					});
			}
			return;
		})
});


// used for state managment.
const generateRandomString = (length: number): string => {
	let text: string = "";
	let possible: string =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i: number = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

export default auth;

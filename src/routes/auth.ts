import { Router } from "express";

import { getSpotifyAccountInfo } from "../spotify/data";

// TYPE IMPORTS
import { Request, Response } from "express";

import {
	getSpotifyAuthTokens,
	refreshSpotifyAuthTokens,
} from "../spotify/auth";

import {
	addUser,
	getAuthTokens,
	getUser,
	setAuthTokens,
	updateUserWithUpsert,
} from "../database/mongo";

import { AuthenticationTokens } from "../types/AuthenticationTypes";
import { AccountInfo } from "../types/DataTypes";

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

/*
	Route: /auth/generate

	Use: Used to generate fresh authentication tokens with the
		 spotify API.

		 - Hit on initial log in (without Spotify ID present in local storage).
	
	Request: 
		body.id = Spotify User ID.
	
	Response:
		body.id = Spotify User ID (ensures fresh).
*/
auth.post("/generate-code", (req, res) => {
	// GENERATE AUTHENTICATION TOKENS WITH SPOTIFY API.
	getSpotifyAuthTokens(req.body.code).then((tokens) => {
		// Ensure tokens were returned.
		if (tokens.authToken === null || tokens.refreshToken === null) {
			res.status(400).send({
				error: "Failed to fetch authentication tokens from Spotify.",
			});
			return;
		} else {
			// Fetch the account information which was used to generate the authentication tokens.
			getSpotifyAccountInfo(tokens).then((accountInfo) => {
				// Updates auth tokens if account exists, or creates new account.
				updateUserWithUpsert(accountInfo.id, tokens).then((success) => {
					if (success) res.status(200).send({ id: accountInfo.id });
					else
						res.status(400).send({
							error: "Failed to update/create account in MongoDB.",
						});
					return;
				});
				return;
			});
		}
		return;
	});
});

auth.post("/generate-id", (req, res) => {
	const id = req.body.id;

	if (id) {
		getAuthTokens(id).then((_tokens: AuthenticationTokens) => {
			validateAuthenticationTokens(id, _tokens)
				.then((tokens: AuthenticationTokens) => {
					getSpotifyAccountInfo(tokens).then(
						(accountInfo: AccountInfo) => {
							res.status(200).send(accountInfo);
							return;
						}
					);
				})
				.catch((error: Error) => {
					res.status(400).send({
						name: error.name,
						message: error.message,
					});
					return;
				});
			return;
		});
	} else {
		res.status(400).send("Spotify ID not provided in request body.");
		return;
	}	
});

// Checks if users authentication tokens are valid.
// If they are returns them, else generates new ones
// And stores them in the DB.
const validateAuthenticationTokens = async (
	id: string,
	tokens: AuthenticationTokens
): Promise<AuthenticationTokens> => {
	if (isExpired(tokens.expirationTimestamp)) {
		// Refresh authentication token.
		refreshSpotifyAuthTokens(tokens)
			.then((tokens: AuthenticationTokens) => {
				if (tokens) {
					setAuthTokens(id, tokens)
						.then((success: boolean) => {
							if (success) return tokens;
							else {
								throw new Error(
									"Failed to set fresh authentication tokens in DB."
								);
							}
						})
						.catch((error: Error) => {
							throw error;
						});
				} else {
					throw new Error(
						"Failed to generate fresh authentication tokens."
					);
				}
			})
			.catch((error: Error) => {
				throw error;
			});
	} else {
		return tokens;
	}
};

// Checks to see if the authToken is expired or will expire within the next second.
const isExpired = (expirationTimestamp: number) => {
	if (Date.now() >= expirationTimestamp + 1000) return true;
	else return false;
};

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

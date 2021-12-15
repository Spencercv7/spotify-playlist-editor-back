import request from "request";

// TYPE IMPORTS
import { AuthenticationTokens } from "../types/AuthenticationTypes";

// INTERFACE IMPORTS
import { ISpotifyAuthRequest } from "../Interfaces/ISpotifyRequest";


export const getSpotifyAuthRequestOptions = (code: string): ISpotifyAuthRequest => {
	return {
		url: "https://accounts.spotify.com/api/token",
		form: {
			code: code,
			redirect_uri: process.env.REDIRECT_URI,
			grant_type: "authorization_code",
		},
		headers: {
			'Authorization':
				"Basic " +
				Buffer.from(
					process.env.SPOTIFY_CLIENT_ID +
						":" +
						process.env.SPOTIFY_CLIENT_SECRET
				).toString("base64"),
		},
		json: true,
	};
};

export const getSpotifyAuthTokens = async (code: string): Promise<AuthenticationTokens> => {
    return new Promise( resolve => {
		request.post(
			getSpotifyAuthRequestOptions(code),
			(error, response, body) => {
				if (!error && response.statusCode === 200) {
					resolve({
						authToken: body.access_token,
						refreshToken: body.refresh_token
					});
				}
			}
		);
	});
}

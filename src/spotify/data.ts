import request from "request";

// TYPE IMPORTS
import { AuthenticationTokens } from "../types/AuthenticationTypes";
import { AccountInfo, Playlists } from "../types/DataTypes";

// INTERFACE IMPORTS
import { ISpotifyBaseRequest } from "../interfaces/SpotifyRequests";

const getSpotifyAccountRequestOptions = (authTokens: AuthenticationTokens): ISpotifyBaseRequest => {
	return {
		url: "https://api.spotify.com/v1/me",
		headers: {
			Authorization: "Bearer " + authTokens.authToken,
		},
		json: true,
	};
};

export const getSpotifyAccountInfo = async (
	authTokens: AuthenticationTokens
): Promise<AccountInfo> => {
	return new Promise((resolve) => {
		request.get(getSpotifyAccountRequestOptions(authTokens), (error, response, body) => {
			if (!error && response.statusCode === 200) {
				resolve({
					country: body.country,
					display_name: body.display_name,
					email: body.email,
					href: body.href,
					id: body.id,
					images: body.images,
					uri: body.uri,
				});
			}
		});
	});
};

const getSpotifyPlaylistsRequestOptions = (authTokens: AuthenticationTokens): ISpotifyBaseRequest => {
	return {
		url: "https://api.spotify.com/v1/me/playlists",
		headers: {
			Authorization: "Bearer " + authTokens.authToken,
		},
		json: true,
	};
};

export const getSpotifyPlaylists = async (authTokens: AuthenticationTokens): Promise<Playlists> => {
	return new Promise((resolve) => {
		request.get(getSpotifyPlaylistsRequestOptions(authTokens), (error, response, body) => {
			if (!error && response.statusCode === 200) {
				resolve({
					lists: body.items,
					next: body.next,
					previous: body.previous,
					total: body.total
				})
			}
		})
	});
}

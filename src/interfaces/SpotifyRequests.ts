export interface ISpotifyBaseRequest {
	url: string,
	headers: {
		"Content-Type"?: string;
		Authorization: string;
	};
	json: boolean;
};

export interface ISpotifyAuthRequest extends ISpotifyBaseRequest {
	form: {
		code: string;
		redirect_uri: string;
		grant_type: string;
	};
}

export interface ISpotifyAuthRefresh extends ISpotifyBaseRequest {
	form: {
		refresh_token: string;
		grant_type: string;
	};
}

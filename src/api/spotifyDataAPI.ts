import request from "request";

// TYPE IMPORTS
import { AuthenticationTokens } from "../types/AuthenticationTypes";
import { AccountInfo } from "../types/DataTypes";

// INTERFACE IMPORTS
import { ISpotifyBaseRequest } from "../Interfaces/ISpotifyRequest";

export const getSpotifyAccountInfo = async (authTokens: AuthenticationTokens): Promise<AccountInfo> => {

    const options: ISpotifyBaseRequest = {
		url: "https://api.spotify.com/v1/me",
        headers: {
            Authorization: 'Bearer ' + authTokens.authToken
        },
        json: true
	};

    return new Promise( resolve => {
        request.get(
            options, 
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(
						({
							country: body.country,
							display_name: body.display_name,
							email: body.email,
							href: body.href,
							id: body.id,
							images: body.images,
							uri: body.uri,
						})
					);
                }       
            }
        )
    });
}
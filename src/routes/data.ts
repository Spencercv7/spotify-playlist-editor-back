import { Router } from "express";

import { getSpotifyAccountInfo, getSpotifyPlaylists } from "../spotify/data";
import { AuthenticationTokens } from "../types/AuthenticationTypes";
import { AccountInfo, Playlists } from "../types/DataTypes";
import { validateAuthenticationTokens } from "./auth";

const data = Router();

data.post("/user", (req, res) => {
	const id = req.body.id;

	if (id) {
		validateAuthenticationTokens(id)
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
	} else {
		res.status(400).send("Spotify ID not provided in request body.");
		return;
	}
});

data.post("/playlists", (req, res) => {
	const id = req.body.id;

	if (id) {
		validateAuthenticationTokens(id).then(
			(tokens: AuthenticationTokens) => {
                console.log(tokens);
				getSpotifyPlaylists(tokens).then((playlists: Playlists) => {
					res.status(200).send(playlists);
					return;
				}).catch((error: Error) => {
                    throw error;
                });
			}
		).catch((error: Error) => {
            res.status(400).send({
                name: error.name,
                message: error.message
            })
        });
	}
});

export default data;

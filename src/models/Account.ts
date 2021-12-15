import mongoose from "mongoose";

// Input attributes from TypeScript
interface IAccount {
	id: string;
	authToken: string;
	refreshToken: string;
}

interface AccountModal extends mongoose.Model<AccountDoc> {
	build(attr: IAccount): AccountDoc;
}

// Output Schema
interface AccountDoc extends mongoose.Document {
	id: string;
	authToken: string;
	refreshToken: string;
}

// MongoDB Schema.
const accountSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	authToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true
	}
});

accountSchema.statics.build = (attr: IAccount): AccountDoc => {
	return new Account(attr);
};

export const Account = mongoose.model<AccountDoc, AccountModal>(
	"Account",
	accountSchema
);

// app.post("/new-user", async (req: Request, res: Response) => {
// 	console.log(req.body);
// 	const account = Account.build({
// 		username: req.body.username,
// 		password: req.body.password,
// 	});
// 	await account.save();
// 	return res.status(201).send(account);
// });

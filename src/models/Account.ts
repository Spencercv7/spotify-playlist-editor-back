import mongoose from "mongoose";

// Input attributes from TypeScript
interface IAccount {
	username: string;
	password: string;
}

interface AccountModal extends mongoose.Model<AccountDoc> {
	build(attr: IAccount): AccountDoc;
}

// Output Schema
interface AccountDoc extends mongoose.Document {
	id: string;
	password: string;
}

// MongoDB Schema.
const accountSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
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

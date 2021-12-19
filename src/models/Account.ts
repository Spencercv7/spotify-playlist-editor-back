import mongoose from "mongoose";

// Input attributes from TypeScript
export interface IAccount {
	id: string;
	authToken: string;
	refreshToken: string;
	expirationTimestamp: number;
}

interface AccountModal extends mongoose.Model<AccountDoc> {
	build(attr: IAccount): AccountDoc;
}

// Output Schema
export interface AccountDoc extends mongoose.Document {
	id: string;
	authToken: string;
	refreshToken: string;
	expirationTimestamp: number;
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
	},
	expirationTimestamp: {
		type: Number,
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

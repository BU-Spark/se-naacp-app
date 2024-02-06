import "dotenv/config";
import mongoose, { Query, Schema } from "mongoose";
import nodemailer from "nodemailer";

const transporter =  nodemailer.createTransport({
	host: "smtp.sendgrid.net",
	port: 465,
	secure: true,
	auth: {
		user: "apikey",
		pass: process.env.SENDGRID_RELAY_KEY
	},
})

let orgs = [];
let results = {};

const getOrgs = async () => {
	const res = await fetch("https://api.clerk.com/v1/organizations/", {
		headers: {
			Authorization: `Bearer ${process.env.CLERK_BACKEND_KEY}`,
		},
	});
	return await res.json();
};

const getOrgMembers = async (org) => {
	const res = await fetch(
		`https://api.clerk.com/v1/organizations/${org}/memberships`,
		{
			headers: {
				Authorization: `Bearer ${process.env.CLERK_BACKEND_KEY}`,
			},
		},
	);

	return await res.json();
};

const articleSchema = new Schema({
		neighborhoods: [String],
		position_section: String,
		tracts: [String],
		author: String,
		body: String,
		content_id: String,
		hl1: String,
		hl2: String,
		pub_date: String,
		pub_name: String,
		link: String,
		openai_labels: [String],
		dateSum: Number,
		userID: String,
}, {collection: "article_data"})
const Article = mongoose.model('Article', articleSchema, "articles_data");

const connectMongo = async() => {
	await mongoose.connect(process.env.MONGODB_PROD_CONN);
	
}


(async () => {
	await connectMongo().then(
		console.log("mongo connected")
	);
	

	const today = new Date();
	var querydate = new Date(today);
	querydate.setDate(today.getDate() - 7)
	const todaydate = Number(today
		.toISOString()
		.split("T")[0]
		.split("-")
		.join(""));
	const sevendays = Number(querydate
		.toISOString()
		.split("T")[0]
		.split("-")
		.join(""));
	console.log(todaydate, sevendays)
	// Only the data we want from the orgs
	const orgs = (await getOrgs()).data;

	for (const org of orgs) {
		const res = await getOrgMembers(org.id);
		let mems = [];
		for (const mem of res.data) {
			mems.push(mem.public_user_data.identifier);
		}
		results[org.name] = { id: org.id, members: mems };
	}
	//console.table(results);

	//Loop to email each org's members
	// for (const org in results) {
	// 	console.log(org)
	// 	const articles = await Article.find({
	// 		dateSum: {
	// 			$lte: todaydate,
	// 			$gte: sevendays
	// 		},
	// 		userID: results[org].id
	// 	}).then(res => console.log(res))
	// }
		

	// EMAIL SENDING TEMPLATE
	// const info = await transporter.sendMail({
  	//   	from: 'malbaker@bu.edu', // sender address
  	//   	to: "mb@malbaker.me", // list of receivers
  	//   	subject: "more testing", // Subject line
  	//   	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // plain text body
	// });

	// console.log("Message sent: %s", info.messageId);
	
})();

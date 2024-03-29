import mongoose, { Schema } from "mongoose";
import nodemailer from "nodemailer";
// import config from "./config.json" assert {type: "json"};

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
// Shape of results: results[org_name] = { id: org_id, members: [...] }
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
}, {collection: "articles_data"})
const Article = mongoose.model('Article', articleSchema, "articles_data");

const connectMongo = async() => {
	await mongoose.connect(process.env.MONGODB_PROD_CONN);
}


(async () => {
    // Connect to mongo

    await connectMongo().then(
        console.log("mongo connected")
    );
    
    // Converting todays date and 7 days previous, into the datesum format for querying articles
    const today = new Date();
    var querydate = new Date(today);
    querydate.setMonth(today.getMonth() - 1)
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

    

    for (const org in results) {
        // Query articles from org in the past week

        const articles = await Article.find({
            dateSum: {
                $lte: todaydate,
                $gte: sevendays
            },
            userID: results[org].id
        }, {
            hl1: 1, dateSum: 1
        }).exec()

        console.log(org, articles.length)

        if (articles.length>0){
            // Email org members with the number of articles in the past week

            // const email_info = await transporter.sendMail({
            //     from: 'malbaker@bu.edu', // sender address
            //     to: results[org].members, // list of receivers
            //     subject: `Update for ${org} from Spark Media Bias`, // Subject line
            //     text: `Hello ${org} members, your organization has uploaded ${articles.length} new articles in the past week. 
            //         Please log into the Media Bias app with the link below to see more details. \n \n https://bu-naacp.up.railway.app`,
            //     html: `<p> \
            //         Hello ${org} members, <br/> \
            //         Your organization has uploaded ${articles.length} new articles in the past week. \
            //         Please <a href=\"https://bu-naacp.up.railway.app/Dashboard\">log into the Media Bias app</a> to see more details.\
            //     </p>`,
            // });
            // console.log("Message sent: %s", email_info.messageId);
        }
    }
        

    //EMAIL SENDING TEMPLATE
    // let articles = [1,2,3,5,6]
    // let org  = "TEST"

    // const email_info = await transporter.sendMail({
    //   	from: 'malbaker@bu.edu', // sender address
    //   	to: "malbaker@bu.edu", // list of receivers
    //   	subject: "test with link", // Subject line
    //   	text: `Hello ${org} members, your organization has uploaded ${articles.length} new articles in the past week. 
    // 				Please log into the Media Bias app with the link below to see more details. \n \n https://bu-naacp.up.railway.app`,
    // 			html: `<p> \
    // 				Hello ${org} members, <br/> \
    // 				Your organization has uploaded ${articles.length} new articles in the past week. \
    // 				Please <a href=\"https://bu-naacp.up.railway.app/Dashboard\">log into the Media Bias app</a> to see more details.\
    // 			</p>`,
    // });
    // console.log("Message sent: %s", email_info.messageId);
    mongoose.disconnect().then(console.log("Bye mongo"));
})();


// cron.schedule("0 10 1 * *", async () => {
//     console.log("node cron hit")
//     await main();
// })
require("dotenv").config();

let orgs = [];

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

(async () => {
	const raw_orgs = (await getOrgs()).data;
	raw_orgs.forEach((ele) => {
		orgs.push({ name: ele.name, id: ele.id });
	});
	let results = {};
	for (const org of orgs) {
		const res = await getOrgMembers(org.id);
		let mems = [];
		for (const mem of res.data) {
			mems.push(mem.public_user_data.identifier);
		}
		results[org.name] = { id: org.id, members: mems };
	}
	console.log(results);
	// const msg = {
	//     to: 'malbaker@bu.edu', // Change to your recipient
	//     from: 'malbaker@bu.edu', // Change to your verified sender
	//     subject: 'Sending with SendGrid is Fun',
	//     text: 'and easy to do anywhere, even with Node.js',
	//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	// }
	// sgMail
	//     .send(msg)
	//     .then(() => {
	//         console.log('Email sent')
	//     })
	//     .catch((error) => {
	//         console.error(error)
	//     })
	// Loop to email each org's members
	// for (const key in results) {
	//     if (results.hasOwnProperty(key)) {
	//         const msg = {
	//             to: results[key]
	//         }
	//     }
	// }
})();

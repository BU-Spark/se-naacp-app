import "dotenv/config";

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

(async () => {
	// Only the data we want from the orgs
	const raw_orgs = (await getOrgs()).data;
	raw_orgs.forEach((ele) => {
		orgs.push({ name: ele.name, id: ele.id });
	});
	for (const org of orgs) {
		const res = await getOrgMembers(org.id);
		let mems = [];
		for (const mem of res.data) {
			mems.push(mem.public_user_data.identifier);
		}
		results[org.name] = { id: org.id, members: mems };
	}
	console.table(results);

	// Loop to email each org's members
	// for (const org in results) {

	// }
})();

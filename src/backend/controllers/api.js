import { Router } from 'express';
import Groups from 'models/groupModel';
import IDCard from 'models/idcardModel';
import PWS from 'models/pwsModel';
import config from 'config/config.json';
import csv from 'csv-express';
import { ensureAPIAuth, ensureAuthOrToken, getAuthToken } from '../utils/helpers';
import { API, Routes } from 'Routes';

let api = Router();

api.get(API.GetMembers, async (req, res) => {
		let result = await Groups.GetMembers(req.params.group);
		let members = await PWS.GetMany(result.Payload);
		let verbose = await IDCard.GetManyPhotos(members);
		return res.status(result.Status).json(verbose);
});

api.get(API.GetToken, (req, res) => {
	let token = getAuthToken(req);
	if(token) {
		return res.status(200).json({token});
	} else {
		return res.status(401).json({token: ""});
	}
});

api.get(API.Logout, (req,res) => {	
	req.logout();
	req.session.destroy();
	res.clearCookie('connect.sid', {path: Routes.Welcome});
	res.sendStatus(200);
});

api.put(API.RegisterMember, ensureAuthOrToken, async (req, res) => {
	let identifier = req.body.identifier;
	let displayId = req.body.displayId;
	let validCard = IDCard.ValidCard(identifier);
	
	if(validCard){
		identifier = await IDCard.Get(validCard);
		identifier = (await PWS.Get(identifier)).UWNetID;
	}
	
	let result = await Groups.AddMember(req.params.group, identifier);
	if(result.Status === 200) {
		let user = await PWS.Get(identifier);
		user.displayId = displayId;
		user.Base64Image = await IDCard.GetPhoto(user.UWRegID);
		res.status(result.Status).json(user);
	} else {
		res.sendStatus(result.Status);
	}
	
});

api.delete(API.RemoveMember, ensureAPIAuth, async (req, res) => {
	let result = await Groups.RemoveMember(req.params.group, req.params.identifier);
	return res.status(result.Status).json(result.Payload);
});

api.get(API.GetSubgroups, ensureAPIAuth, async (req, res) => {
	let result = await Groups.SearchGroups(req.params.group);
	return res.status(result.Status).json(result.Payload);
});

api.delete(API.RemoveSubgroup, ensureAPIAuth, async (req, res) => {
	let result = await Groups.DeleteGroup(req.params.group);
	return res.status(result.Status).json(result.Payload);
});

api.post(API.CreateGroup, ensureAPIAuth, async (req, res) => {
	let result = await Groups.CreateGroup(req.params.group);
	return res.status(result.Status).json(result.Payload);
});

api.get(API.CheckAuth, async (req, res) => {
	if(req.isAuthenticated()) {
		if(req.session && !req.session.IAAAgreed)
		{
			let members = await (Groups.GetMembers(config.idaaGroupID)).Payload;
			if(members.indexOf(req.user.UWNetID) > -1) {
				req.session.IAAAgreed=true;
			}else{
				res.redirect(config.groupNameBase)
			}			
		}
		return res.sendStatus(200);
	} else {
		// using 202 because 4xx throws a dumb error in the chrome console,
		// anything but 200 is fine for this use case
		return res.sendStatus(202);
	}
});

api.get(API.Config, (req, res) => {
	let whitelist = ["idcardBaseUrl", "pwsBaseUrl", "photoBaseUrl", "groupsBaseUrl", "groupNameBase"];
	let filteredConfig = Object.keys(config)
			.filter(key => whitelist.includes(key))
			.reduce((obj, key) => {
					obj[key] = config[key];
					return obj;
			}, {});
	res.status(200).json(filteredConfig);
});

api.get(API.CSV, async (req, res) => {
	let members = await Groups.GetMembers(req.params.group);
	let csvWhitelist = ["DisplayName", "UWNetID", "UWRegID"];
	let verboseMembers = await PWS.GetMany(members.Payload, csvWhitelist);
	res.csv(verboseMembers, true);
});

export default api;

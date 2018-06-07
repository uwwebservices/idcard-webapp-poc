// 
export function ensureAuth() {
	return function (req, res, next) {
		if (req.isAuthenticated()) {
			console.log("Authenticated");
			req.user.Shib = true;
			return next();
		} else if(process.env.NODE_ENV === 'development') {
			console.log("Running in development mode - Auth Disabled");
			req.user = { UWNetID: 'DEVELOPMENT', DisplayName: 'Dev User', Shib: false };
		}
		else {
			console.log("Not Authenticated");
			req.user.Shib = false;
			if (req.session) {
				req.session.authRedirectUrl = req.originalUrl;
			}
			else {
				console.warn('passport-uwshib: No session property on request! Is your session store unreachable?');
			}
			res.redirect("/login");
		}
	};
};

export function backToUrl(url = "/") {
	return function (req, res) {
		if (req.session) {
			url = req.session.authRedirectUrl;
			delete req.session.authRedirectUrl;
		}
		res.redirect(url || "/");
	};
};

export function ensureAPIAuth(req, res, next) {
	if(req.isAuthenticated() || process.env.NODE_ENV === 'development') {
		return next();
	} else {
		res.json({"error": "Not Authenticated"});
	}
}
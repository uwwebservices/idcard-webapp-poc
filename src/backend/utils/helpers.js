export function ensureAuth(adminOnly = false) {
	return function (req, res, next) {
		if (req.isAuthenticated() || process.env.NODE_ENV === 'development') {
			console.log("Authorized");
			return next();
		}
		else {
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
		res.redirect(url);
	};
};
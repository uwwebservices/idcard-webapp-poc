import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './routes/api';
import frontend from './routes/frontend';
import configurator from './config/configurator';
let config = configurator.get();

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: ["Link"]
}));

app.use(bodyParser.json({
	limit : "100kb"
}));

// api router
app.use('/api', api);

// frontend
app.use('/', frontend);

// static files
if(process.env.NODE_ENV === 'prod') {
	app.use("/assets", express.static('dist/assets'))
}

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port} in '${process.env.NODE_ENV}' environment.`);
});

export default app;

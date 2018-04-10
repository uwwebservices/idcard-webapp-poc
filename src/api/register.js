import register from '../models/registerModel';
import { Router } from 'express';
import csv from 'csv-express';

let api = Router();

api.get('/', (req, res) => {
    let verbose = req.query.verbose == 'true' ? 2 : 0;
    return register.list(verbose).then((result) => {
        return res.json(result);
    });
});

api.put('/:identifier', (req, res) => {
    let verbose = req.query.verbose == 'true' ? true : false;
    register.add(req.params.identifier, verbose).then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(err.statusCode).json({"error": err.message});
    })
});

api.delete('/:netid', (req, res) => {
    register.remove(req.params.netid).then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(err.statusCode).json({"error": err.message});
    })
});

api.get('/memberlist.csv', (req, res) => {
    register.list(1).then((members) => {
        console.log(members);
        res.csv(members.users, true);
    }).catch((err) => {
        console.log("error serializing to csv:", err);
        res.status(500);
    })
});

export default api;




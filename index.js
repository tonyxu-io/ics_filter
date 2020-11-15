import fs from 'fs'
import util from 'util'
import express from 'express'
import request from 'request'
import ICAL from 'ical.js'
const requestGet = util.promisify(request.get)
const getConfig = () => JSON.parse(fs.readFileSync('config.json', { encoding: 'utf8' }));

let CONFIG = getConfig();

const getPropertyValue = (event, name) => {
    for (let property of event[1]) {
        if (property[0] === name) {
            return property[3]
        }
    }

    return null
}

const validateFilter = (event, filter) => {
    for (let filterField in filter) {
        const regex = new RegExp(filter[filterField].replace('\\\\', '\\'))
        if (!regex.test(getPropertyValue(event, filterField))) {
            return false;
        }
    }

    return true;
}

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello! <br>This is a private calender server. <br>See: https://github.com/quinten1333/ics_filter')
});

app.get('/reload', (req, res) => {
    CONFIG = getConfig()
    res.send('Reloaded config.');
})

app.get('/:calenderName.ics', async (req, res, handleErr) => {
    const calanderName = req.params.calenderName;

    if (!CONFIG[calanderName]) {
        res.status(404).json('Not found.');
        return;
    }

    const calenderConf = CONFIG[calanderName]
    if (!calenderConf.url || !calenderConf.filters) {
        res.status(502).send('No url or filter specified');
        return;
    }

    let ics;
    try {
        ics = await requestGet(calenderConf.url);
    } catch (err) {
        handleErr(err);
        return;
    }
    if (ics.statusCode !== 200) {
        res.status(500).send('Could not get original ics data.');
        return;
    }

    const ical = ICAL.parse(ics.body);
    const events = ical[2]

    const newEvents = []

    for (let event of events) {
        for (let filter of calenderConf.filters) {
            if (validateFilter(event, filter)) {
                continue
            }

            newEvents.push(event)
        }
    }

    ical[2] = newEvents
    const comp = new ICAL.Component(ical);

    res.setHeader('content-type', 'text/calendar');
    res.send(comp.toString());
});

app.use((err, req, res, next) => {
    console.log('Catched error: ', err)
    res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Calendar server listening at http://localhost:${port}`)
});

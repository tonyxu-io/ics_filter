import express from 'express'
import axios from 'axios'
import ICAL from 'ical.js'

let configRemote = await axios.get("https://gist.githubusercontent.com/tonyxu-io/22169c099f7693d7ab66a5c6a282be5a/raw");

let CONFIG = configRemote.data

const getPropertyValue = (event, name) => {
    for (let property of event[1]) {
        if (property[0] === name) {
            return property[3]
        }
    }

    return null
}

/**
 *
 * @param {ICSEvent} event The event
 * @param {Dict} filter The filter dictionary
 * @returns true if the event matches the filter, false otherwise.
 */
const validateFilter = (event, filter) => {
    for (let filterField in filter) {
        const regex = new RegExp(filter[filterField].replace('\\\\', '\\'))
        if (!regex.test(getPropertyValue(event, filterField))) {
            return false;
        }
    }

    return true;
}

/**
 *
 * @param {ICSEvent} event The event
 * @param {Array<Dict>} filters Array of filter dictionaries
 * @returns true if the event matches one filter, false otherwise.
 */
const validateFilters = (event, filters) => {
    for (let filter of filters) {
        if (validateFilter(event, filter)) {
            return true;
        }
    }

    return false;
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
        ics = await axios.get(calenderConf.url);
    } catch (err) {
        handleErr(err);
        return;
    }
    if (ics.status !== 200) {
        res.status(500).send(`Could not get original ics data. Got response code ${ics.status} and body: ${ics.data}`);
        return;
    }

    const ical = ICAL.parse(ics.data);
    const events = ical[2]

    const newEvents = []

    for (let event of events) {
        if (validateFilters(event, calenderConf.filters)) {
            continue;
        }

        newEvents.push(event)
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

# ics filter
Filter away all events from an iCal stream which mach the specified filters

## config
The `config.json` file configures all available calanders and their filters.
The filters make it possible to create a compicated if statement.

The following json:
```json
{
    "canvas": {
        "url": "https://canvas.uva.nl/feeds/calendars/XXX.ics",
        "filters": [
            {
                "location": "^Zoom Online Meeting$",
                "name": "Laptopcollege"
            },
            {
                "location": "^Zoom Online Meeting$",
                "name": "Hoorcollege"
            }
        ]
    }
}
```

Will translate in the following ifstatement:
```javascript
if (/^Zoom Online Meeting$/.test(event.location) && /Laptopcollege/.test(event.name)) || (/^Zoom Online Meeting$/.test(event.location) && /Hoorcollege/.test(event.name)) {
    // Filter the event.
}
```

## Running the server
Run the server using `npm start`, this will start the server on the port specified in the enviroment variable PORT or 3000 if this variable is not precent.

## Running the server using docker
First you need to build the docker image using `docker build . -t ics_filter:latest`
Then you can run it using: `docker run -d -p 80:80 ics_filter:latest`
If you wish to send it to an external server, withoud using a docker image repository, over SSH you can use this command to do so: `docker save <image name> | ssh -C <ssh connection param> docker load`

## Import new feed
Using your favourite calendar software, import the new file from the server by navigating to:
`domain.name/<calanderName>.ics`

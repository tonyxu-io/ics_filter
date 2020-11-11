# zoomout
Filter away all events from an iCal stream where the location is Zoom


# Example setup for Canvas

## Preparation `zoomout`
1. Copy `config.toml.example` to `config.toml`
2. Go to your Canvas calendar and click "Calendar feed"
3. Copy the URL shown and paste it in the config file

## Preparation webserver
4. Make sure the `filtered.ics` file can be accessed on some URL
5. Personally I just make a hard link to this file in `/var/www/<my site>/filtered.ics`, where I was already hosting my website

## Run
6. Run `nohup alwaysrun-zoomout.sh &` on your server, this refreshes `filtered.ics` every minute

## Import new feed
7. Using your favourite calendar software, import the new file from your own domain

# Exercises left to the reader
* Set up a webserver and your own domain
* Make sure the script auto-restarts when your server reboots
* Only refresh the `filtered.ics` file when needed

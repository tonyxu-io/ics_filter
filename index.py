import icalendar
import toml
import urllib.request

# Read URL from config
config = toml.load("config.toml")
url = config['url']

# Retrieve URL
stream = urllib.request.urlopen(url).read()

# Parse as feed
feed = icalendar.Calendar.from_ical(stream)

# Make new feed
newcal = icalendar.Calendar()

# Copy props
for prop in feed:
    newcal[prop] = feed[prop]

# Update calname
if 'X-WR-CALNAME' in newcal:
	newcal['X-WR-CALNAME'] += " (filtered)"

# Filter events
for event in feed.walk('VEvent'):
	if 'location' not in event or event['location'] != "Zoom Online Meeting":
		newcal.add_component(event)

# Output new filtered calendar
print(newcal.to_ical().decode('utf-8'))

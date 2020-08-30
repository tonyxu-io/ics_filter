import icalendar
import toml
import urllib.request

# Read URL from config file
config = toml.load("config.toml")
url = config['url']

# Retrieve URL
rawcal = urllib.request.urlopen(url).read()

# Parse as calendar
cal = icalendar.Calendar.from_ical(rawcal)

# Make new calendar
newcal = icalendar.Calendar()

# Copy props
for prop in cal:
    newcal[prop] = cal[prop]

# Update calname
if 'X-WR-CALNAME' in newcal:
	newcal['X-WR-CALNAME'] += " (filtered)"

# Filter events
for event in cal.walk('VEvent'):
    
    # Skip if Zoom
    if 'DESCRIPTION' in event and "Zoom Meeting" in event['DESCRIPTION']:
        continue
    if 'LOCATION' in event and "Zoom Online Meeting" in event['LOCATION']:
        continue

    # Add event to new calendar
    newcal.add_component(event)

# Output new filtered calendar
print(newcal.to_ical().decode('utf-8'))

imageName=ghcr.io/quinten1333/ics_filter:latest

.phony: build push run runDebug

build:
	docker build -t ${imageName} .

push:
	docker push ${imageName}

run:
	docker run --rm -p 3000:80 -it --name="ics_filter" ${imageName}

runDebug:
	docker run --rm -p 3000:80 -it --name="ics_filter" --entrypoint=/bin/sh ${imageName}

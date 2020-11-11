#!/usr/bin/env bash

while true; do
	python index.py > filtered.ics 2>> errors.log
	sleep 60
done

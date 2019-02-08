# Image resize microservice


## Setup

For dev installation you should run:
```
npm install --arch=x64 --platform=linux
```

Check docker-compose.yml to create a similar setup or to run
this container in dev mode. Change volume mappings to your needs.

Current docker-compose is running the service in dev mode.
Access the service on your local machine: http://localhost:8081


## Usage:
Call http://localhost:8081/stats to get statistics about the module usage.

Call http://localhost:8081/images/1.jpg - you should get an original
image.

Call http://localhost:8081/images/800x600/1.jpg to get the same 
image resized to 800x600

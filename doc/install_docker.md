# Install build environment using Docker

## Prerequisites
Install the Docker container services using your favorite package manager.

Copy the Dockerfile to a different build directory, to avoid passing the entire wallet directory content to the docker build environment as context.
```
cp Dockerfile <buildlocation>
cd <buildlocation>
```

Then build the docker image using the Dockerfile:
```
docker build .
```
Tag the build result, naming it 'alastria':
```
IMGID=`docker images -a | head -2 | tail -1 | awk '{print $3}'`
docker tag $IMGID alastria
```

## Running the docker container
The Docker container supplies a shell interface to access the NPM, Angular and Ionic build tools. It also has a default 'init' command that initialises the NPM modules and (tries to) adjust an angular build file as per the README documentation. Run the following command from the wallet repository:
```
docker run -v <wallet repository>:/data/wallet alastria
```

This will execute an `npm install` on the current wallet repository and checkout the alastria-identity subrepository.

Specifying either the `npm`, `ng` or `ionic` build environment will allow you to pass arguments to those build tools. For example, from inside the alastria-wallet repository:
```
docker run -v `pwd`:/data/wallet alastria npm install
docker run -v `pwd`:/data/wallet alastria ng build --prod --watch
docker run -v `pwd`:/data/wallet alastria ionic cordova build android
```

The last command will build an Android package that can be installed on an emulator.

## Docker runtime options
The build process takes quite some memory and CPU power. Specify `-m 4g` to set the docker memory limit to 4Gigabyte. Specify `--cpus=2` to allow the use of at least 2 cpus. These are recommended minimum settings for a timely build. Using less than 2Gigabyte will cause the build to fail.

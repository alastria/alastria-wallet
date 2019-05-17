# Alastria Prototype Ionic App

Example mobile application to implement Alastria user stories

## Installation

### Requirements
* Node.js 8+
* Yarn
* Ionic 3 / Angular 6
* Android / iOS SDK
* Cordova 7.1.0+
* Barcode Scanner

ionic cordova plugin add phonegap-plugin-barcodescanner

## Installation

```yarn
yarn install
```

## Development
```
$ yarn start:browser
```

## Android deployment (emulator)
```
$ yarn start:android
```

## Android deployment (device)
```
$ yarn start:android:device
```

## Test backend

Inside the folder "testBackend" there is a node simple project to test the dev app. To install go inside this foldel and run:
```
npm install
```
To start the server run:
```
npm start
```

## Contributing
Pull requests are welcome!.

Please make sure to update tests as appropriate.
# Alastria Prototype Ionic App

Example mobile application to implement Alastria user stories

## Starting 🚀

These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes:

Clone the proyect:
```
git clone https://github.com/alastria/alastria-wallet.git
```

## Installation 🔧

### Requirements
* Node.js 8+
* Yarn / Npm
* Ionic 3 / Angular 6
* Android SDK / iOS SDK
* Cordova 7.1.0+
* Barcode Scanner

ionic cordova plugin add phonegap-plugin-barcodescanner

```
yarn install
```
or
```
npm install
```

**AFTER INSTALLATION: it is necessary to change these code lines (54 and 69 in node_modules/web3-eht-abi/src/index.js)
```
 functionName = utils._jsonInterfaceMethodToString(functionName);
```
to 
```
functionName = utils.jsonInterfaceMethodToString(functionName);
```


### Run application in browser
```
yarn start:browser
```
or
```
npm run start:browser
```

### Run application in emulator or in mobile debug mode
```
yarn start:android:device
```
or
```
npm run start:android:device
```

### Android apk build
```
yarn start:android
```
or
```
npm run start:android
```
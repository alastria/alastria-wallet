# AlastriaID Wallet Installation

These instructions are for installing and compiling the AlastriaID wallet code on Ubuntu 16.04 LTS.
The end-result is an APK file that you can upload to your Android emulator.

We assume a vanilla Ubuntu 16.04 environment without other tooling, like a freshly setup installation.
For information on how to setup a virtual server, please refer to documentation on Vagrant, VirtualBox
and other virtualisation platforms. The compilation process requires at least a 2Gb, 2CPU environment.

We're installing Node@10, Ionic@5.2.1, Cordova@9 and Angular@8.2
The original installation says Node@8+, but Angular@8.2 requires Node@10.
For Android, we take the latest version at the time of writing.

## Basic build tools
```
sudo apt install git zip unzip -y

curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
sudo apt-get install -y gcc g++ make
sudo apt-get install -y default-jdk
```

## Install Android build tools
```
cd $HOME
wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip
unzip commandlinetools-linux-6609375_latest.zip

mkdir sdk
mv commandlinetools-linux-6609375 sdk/tools
export ANDROID_SDK_ROOT=$HOME/sdk
export ANDROID_HOME=$HOME/sdk
export PATH=$PATH:$HOME/sdk/tools/bin
sdkmanager --sdk_root=$ANDROID_SDK_ROOT "tools"
sdkmanager --sdk_root=$ANDROID_SDK_ROOT 'platform-tools'
sdkmanager --sdk_root=$ANDROID_SDK_ROOT "platforms;android-30"
sdkmanager --sdk_root=$ANDROID_SDK_ROOT "build-tools;30.0.2"
sdkmanager --sdk_root=$ANDROID_SDK_ROOT "cmdline-tools;latest"
```

## Install Gradle
```
curl -s "https://get.sdkman.io" | bash
source "/home/michiel/.sdkman/bin/sdkman-init.sh"
sdk install gradle 6.6.1
```

## Install Wallet build tools
```
sudo npm install -g ionic@5.2.1 cordova@9
sudo npm install -g @angular/cli@8.2
sudo npm install -g native-run

# the following is necessary due to a bug in this version of NPM 
sudo chown `id -u`:`id -g` -R ~/.npm
sudo chown `id -u`:`id -g` -R ~/.config
```

## Wallet Installation
```
cd $HOME
git clone https://github.com/alastria/alastria-wallet.git

cd alastria-wallet
npm install
 
# see: https://github.com/auth0/node-jsonwebtoken/issues/471#issuecomment-398798497
# change the file
# At the bottom, change
#    node: false
# to
#    node: { crypto: true, stream: true, buffer:true },
cd node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs
cat browser.js | sed 's/^\(.*\)node: false\(.*\)$/\1node: { crypto: true, stream: true, buffer:true }\2/' > tmp
mv tmp browser.js
cd $HOME/alastria-wallet
```

## Build the Wallet
```
ionic cordova run android --no-native-run
```

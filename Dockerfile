FROM ubuntu:xenial
WORKDIR /data/wallet

RUN apt update
RUN apt install -y zip unzip curl gcc g++ make wget git

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt update
RUN apt-get install -y nodejs

RUN apt-get install -y default-jdk
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip
RUN unzip commandlinetools-linux-6609375_latest.zip

RUN npm install -g ionic@5.2.1 cordova@9
RUN echo "y" | npm install -g @angular/cli@8.2

RUN mkdir /usr/local/sdk
RUN mv tools /usr/local/sdk/tools
ENV ANDROID_SDK_ROOT=/usr/local/sdk
ENV ANDROID_HOME=/usr/local/sdk

RUN echo "y" | /usr/local/sdk/tools/bin/sdkmanager --sdk_root=$ANDROID_SDK_ROOT "tools"
RUN /usr/local/sdk/tools/bin/sdkmanager --sdk_root=$ANDROID_SDK_ROOT "build-tools;28.0.3"

# We need to install a version of gradle to allow Cordova to set the gradle wrapper
# The actual version does not really matter apparently, as Cordova will download
# its own gradle version anyway. This mentions version 4.10.3, but 6.6.1 works as well
RUN curl -s "https://get.sdkman.io" | /bin/bash
RUN echo "#~/bin/bash\n\
source $HOME/.sdkman/bin/sdkman-init.sh\n\
sdk install gradle 4.10.3" | sed 's/~/!/' > $HOME/installgradle
RUN chmod a+x $HOME/installgradle
RUN $HOME/installgradle

# Here we create a new ionic/cordova project for the sole purpose of forcing 
# Cordova to pre-install it's version of gradle. This prevents the build process
# from having to download the gradle version each time you want to build a new
# android version
RUN echo "#~/bin/bash\n\
cd /root\n\
ionic start Test blank --cordova\n\
cd /root/Test\n\
\n\
source /root/.sdkman/bin/sdkman-init.sh\n\
export PATH=/root/.sdkman/candidates/gradle/current/bin:$PATH\n\
\n\
ionic cordova build android\n\
cd /root && rm -rf Test" | sed 's/~/!/' > $HOME/preinstallgradle
RUN chmod a+x $HOME/preinstallgradle
RUN $HOME/preinstallgradle

ENTRYPOINT ["/usr/local/bin/alastria"]
CMD ["init"]

RUN echo "#~/bin/bash\n\
set -e\n\
echo \"\$@\"\n\
source /root/.sdkman/bin/sdkman-init.sh\n\
export PATH=/root/.sdkman/candidates/gradle/current/bin:$PATH\n\
\n\
cd /data/wallet\n\
case \$1 in\n\
wait)\n\
    sleep \$2\n\
    ;;\n\
init)\n\
    npm install\n\
\n\
    cd node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs\n\
    cat browser.js | sed 's/^\(.*\)node: false\(.*\)\$/\\1node: { crypto: true, stream: true, buffer:true }\\2/' > tmp\n\
    mv tmp browser.js\n\
    cd /data/wallet\n\
    ;;\n\
i*)\n\
    # ionic command\n\
    shift 1\n\
    exec ionic \"\$@\"\n\
    ;;\n\
ng)\n\
    # angular command\n\
    shift 1\n\
    exec ng \"\$@\"\n\
    ;;\n\
npm)\n\
    # node package manager command\n\
    shift 1\n\
    exec npm \"\$@\"\n\
    ;;\n\
*)\n\
    echo \"Unrecognised command \$1\"\n\
    ;;\n\
esac\n\
" | sed 's/~/!/' > /usr/local/bin/alastria

RUN chmod a+x /usr/local/bin/alastria


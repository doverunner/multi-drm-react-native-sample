# DoveRunner Multi-DRM sample for React-Native-Video

This sample code shows how to integrate DoveRunner Multi-DRM with [react-native-video](https://github.com/react-native-video/react-native-video) project. It supports streaming playback of DRM-protected contents on React Native based Android and iOS applications.

 - Android: MPEG-DASH content protected by Widevine DRM
 - iOS: HLS content protected by FairPlay Streaming DRM

> If you want download/offline scenario support, you may need to implement the feature on your own or use our `Multi-DRM Client SDK for React Native` product which is under development.

## Requirements

This sample requires components and environments as below:

 - React Native 0.76.9 or later
 - react-native-video 6.14.0 or later

> On Apple silicon environment such as M1, latest version of React Native can cause issues. So it is recommended to use 0.68.2 on those development environment.

## Creating React Native project

After setting up React Native development environment, create a project by running the command below:

  ```bash
  # for systems other than Apple silicon
  $ react-native init ProjectName
 
  # for Apple silicon devices such as M1 MacBook, you may need to use 0.68.2 version of React Native
  # $ react-native init ProjectName --version 0.68.2
  ```

## Installing react-native-video package

Install the [react-native-video](https://github.com/react-native-video/react-native-video) package version 6.0.0 or higher on the project.

  ```bash
   $ yarn add react-native-video // or npm install react-native-video
  
  ```

## Doverunner Multi-DRM integration

Apply Doverunner Multi-DRM integration on `App.tsx` file in your project by referring to this sample code. You may need to replace the below values if you want to test your own DRM content.

  - DRM content URL : Input your DASH mpd URL in `source > uri` parameter
  - License server URL : Input our DRM license server URL (`https://drm-license.doverunner.com/ri/licenseManager.do`)
  - Certificate URL: Input your FPS cert URL with your site ID (`https://drm-license.doverunner.com/ri/fpsKeyManager.do?siteId=Your Site ID`)
  - DRM Auth data : Input Doverunner DRM license token string as `pallycon-customdata-v2` custom header.

### App.js code example

    ```jsx
    import * as React from 'react';
    import {Text,View,StyleSheet,Platform,TextInput,Alert,Button} from 'react-native';
    import Video, { DRMType, ReactVideoSourceProperties } from 'react-native-video';

    type SourceType = ReactVideoSourceProperties | null;
    
    const DRMExample = () => {
      const [loading, setLoading] = React.useState(false);
      const [source, setSource] = React.useState<SourceType>(null);

      const [dash, setDash] = React.useState('<Widevine DRM MPD URL>',);
      const [hls, setHls] = React.useState('<FairPlay DRM HLS URL>',);
      const [doverunnerLicense, setDoverunnerLicense] = React.useState('https://drm-license.doverunner.com/ri/licenseManager.do',);
      const [fairplayCertificate, setFairplayCertificate] = React.useState('https://drm-license.doverunner.com/ri/fpsKeyManager.do?siteId=<YOUR SITE ID>',);

      // ------------- DMR AuthData -------------
      // https://devconsole.doverunner.com/drm-tools/license-token/#token-generator
      const [fairpalyAuthData, setFairPalyAuthData] = React.useState('<YOUR FAIRPLAY AUTH DATA>');
      const [widevineAuthData, setWidevineAuthData] = React.useState('<YOUR WIDEVINE AUTH DATA>');

      const handlePlayStopVideo = () => {

        ...

        const newSource: ReactVideoSourceProperties = {};

        if (Platform.OS === 'ios') {
          if (doverunnerLicense && fairplayCertificate) {
            newSource.uri = hls;
            newSource.drm = {
              type: DRMType.FAIRPLAY,
              licenseServer: doverunnerLicense,
              certificateUrl: fairplayCertificate,
              base64Certificate: true,
              getLicense: (spcBase64, contentId, licenseUrl, loadedLicenseUrl) => {
                const bodyData = `spc=${encodeURIComponent(spcBase64)}`;
                const resultURL = loadedLicenseUrl.replace('skd://', 'https://');
                return fetch(`https://drm-license.doverunner.com/ri/licenseManager.do`, {
                  method: 'POST',
                  headers: {
                    'pallycon-customdata-v2': fairpalyAuthData,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: bodyData,
                })
                  .then((response) => response.json())
                  .then((response) => {
                    return response.license;
                  })
                  .catch((error) => {
                    console.error('Error', error);
                  });
              },
            };
          } else {
            Alert.alert('Error', 'Please enter Fairplay License and Certificate');
            setLoading(false);
          }
        }

        if (Platform.OS === 'android') {
          if (doverunnerLicense) {
            newSource.drm = {
              type: DRMType.WIDEVINE,
              licenseServer: doverunnerLicense,
              headers: {
                'pallycon-customdata-v2': widevineAuthData,
                'Content-Type': 'application/octet-stream',
              },
            };
            newSource.uri = dash;
          } else {
            Alert.alert('Error', 'Please enter Widevine License');
            setLoading(false);
          }
        }

        setSource(newSource);
      };
    }

    ```

### Running the project on Android device

You can test the sample on a Widevine-supported Android device using the commands below:

  ```bash
  # find connected device
  $ adb devices
  List of devices attached
  RXXXXXXXXTW	device
    
  # change TCP port to 8081 
  $ adb reverse tcp:8081 tcp:8081
    
  # run the project
  $ react-native run-android
  ```


### Running the project on iOS device

Install dependency libraries of the project and open the generated Xcode workspace.

  ```bash
  $ cd projectName/ios && pod install
   
  # if pod install is not working on Apple silicon, try the below
  # arch -x86_64 pod install
    
  $ open projectName.xcworkspace
  ```

> To test the playback of FPS content, you need an iOS/iPadOS device or Apple silicon macOS device. You cannot test it on an iOS simulator.


## Useful links

- [DoveRunner Multi-DRM Guide Documents](https://doverunner.com/docs/en/multidrm/)
- [DoveRunner Multi-DRM License Token Guide](https://doverunner.com/docs/en/multidrm/license/license-token/)
- [FairPlay Certificate Registration Tutorial](https://doverunner.com/docs/en/multidrm/license/fps-cert-tutorial/)
- [License Token Generation on DevConsole](https://sample.doverunner.com/dev/devconsole/customData.do?lang=en#create-token)
- [react-native-video Document](https://github.com/react-native-video/react-native-video/blob/master/API.md)

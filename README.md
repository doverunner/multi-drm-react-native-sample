# DoveRunner Multi-DRM sample for React-Native-Video

This sample code shows how to integrate DoveRunner Multi-DRM with [react-native-video](https://github.com/react-native-video/react-native-video) project. It supports streaming playback of DRM-protected contents on React Native based Android and iOS applications.

 - Android: MPEG-DASH content protected by Widevine DRM
 - iOS: HLS content protected by FairPlay Streaming DRM

> If you want download/offline scenario support, you may need to implement the feature on your own or use our `Multi-DRM Client SDK for React Native` product which is under development.

## Requirements

This sample requires components and environments as below:

 - React Native 0.68.2 or later
 - react-native-video 6.0.0 or later

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
  # Using 6.0.0-alpha.1 which is the latest version as of now.
  $ npm install react-native-video@6.0.0-alpha.1
  or
  $ yarn add react-native-video@{{6.0.0-alpha.1}} 
  ```

## Widevine DRM integration for Android

Apply Widevine DRM integration on `App.js` file in your project by referring to this sample code. You may need to replace the below values if you want to test your own Widevine content.

  - Widevine content URL : Input your DASH mpd URL in `source > uri` parameter
  - License server URL : Input our DRM license server URL (`https://license-global.pallycon.com/ri/licenseManager.do`)
  - DRM custom data : Input PallyCon DRM license token string as `pallycon-customdata-v2` custom header.

### App.js code example

    ```jsx
    import React from "react";
    import { StyleSheet, View } from "react-native";
    import Video, { DRMType } from 'react-native-video';
    
    const VideoPlayer = () => {
      return (
        <View style={styles.container}>
          <Video
          source={{ 
            uri: "https://Widevine.DRM.ContentURL.mpd" 
          }}
          style={styles.fullScreen}
          paused={false}
          resizeMode={"cover"}
          onLoad={e => console.log(e)}
          repeat={true}
          onAnimatedValueUpdate={() => {}}
          drm={{
            type: DRMType.WIDEVINE,
            licenseServer:'https://license-global.pallycon.com/ri/licenseManager.do',
            headers: {          
              'pallycon-customdata-v2': "PallyCon Token String",
              'Content-Type': 'application/octet-stream'
            }
           }}/>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      },
      fullScreen: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    });
    
    export default VideoPlayer;
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

## FairPlay Streaming (FPS) DRM integration for iOS

Apply FPS DRM integration on `App.js` file in your project by referring to this sample code. You may need to replace the below values if you want to test your own FairPlay content.

  - FPS content URL: Input your HLS m3u8 URL in `source > uri` parameter
  - License server URL: Input our DRM license server URL (`https://license-global.pallycon.com/ri/licenseManager.do`)
  - Certificate URL: Input your FPS cert URL with your site ID (`https://license.pallycon.com/ri/fpsKeyManager.do?siteId=Your Site ID`)
  - DRM custom data: Input DoveRunner DRM license token string as `pallycon-customdata-v2` custom header.

### App.js code example

    ```jsx
    import React from "react";
    import { StyleSheet, View } from "react-native";
    import Video, { DRMType } from 'react-native-video';
    
    const VideoPlayer = () => {
      return (
        <View style={styles.container}>
          <Video
          source={{ 
            uri: "https://FPS.DRM.ContentURL.m3u8" 
          }}
          style={styles.fullScreen}
          paused={false} 
          resizeMode={"cover"} 
          onLoad={e => console.log(e)} 
          repeat={true} 
          onAnimatedValueUpdate={() => {}}
          drm={{
            type: DRMType.FAIRPLAY,
            licenseServer:'https://license-global.pallycon.com/ri/licenseManager.do',
            certificateUrl: 'https://license.pallycon.com/ri/fpsKeyManager.do?siteId=Your Site ID',
            base64Certificate: true,       
            headers: {          
              'pallycon-customdata-v2': "PallyCon Token String",
              'Content-Type': 'application/x-www-form-urlencoded'
            }
           }}/>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      },
      fullScreen: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    });
    
    export default VideoPlayer;
    ```

### pod install

Install dependency libraries of the project and open the generated Xcode workspace.

  ```bash
  $ cd projectName/ios && pod install
   
  # if pod install is not working on Apple silicon, try the below
  # arch -x86_64 pod install
    
  $ open projectName.xcworkspace
  ```

> To test the playback of FPS content, you need an iOS/iPadOS device or Apple silicon macOS device. You cannot test it on an iOS simulator.



### Fix react-native-video

Modify the `RCTVideo.swift` file in the iOS folder as shown below.
```swift
// RCTVideo.swift
// On line 345, change self.onGetLicense to nil to get the license.
if self._drm != nil || self._localSourceEncryptionKeyScheme != nil {
  self._resouceLoaderDelegate = RCTResourceLoaderDelegate(
    asset: asset,
    drm: self._drm,
    localSourceEncryptionKeyScheme: self._localSourceEncryptionKeyScheme,
    onVideoError: self.onVideoError,
    onGetLicense: nil, // <<-- self.onGetLicense -> nil
    reactTag: self.reactTag
  )
}
```



## Useful links

- [DoveRunner Multi-DRM Guide Documents](https://doverunner.com/docs/en/multidrm/)
- [DoveRunner Multi-DRM License Token Guide](https://doverunner.com/docs/en/multidrm/license/license-token/)
- [FairPlay Certificate Registration Tutorial](https://doverunner.com/docs/en/multidrm/license/fps-cert-tutorial/)
- [License Token Generation on DevConsole](https://sample.pallycon.com/dev/devconsole/customData.do?lang=en#create-token)
- [react-native-video Document](https://github.com/react-native-video/react-native-video/blob/master/API.md)

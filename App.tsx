
// import React from "react";
// import { StyleSheet, View } from "react-native";
// import Video from 'react-native-video';

// const VideoPlayer = () => {
//   return (
//     <View style={styles.container}>
//       <Video
           // non DRM 
//         source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }}
//         style={styles.fullScreen}
//         controls={true}
//         onError={error => console.error('Simple Video Error:', error)} // 오류 로깅
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white"
//   },
//   fullScreen: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0
//   }
// });
// export default VideoPlayer;


import * as React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Platform, 
  ScrollView, 
  TextInput, 
  Alert, 
  Button, 
  ActivityIndicator, 
} from 'react-native';
import Video, { DRMType, ReactVideoSourceProperties } from 'react-native-video';

type SourceType = ReactVideoSourceProperties | null;

const DRMExample = () => {
  const [loading, setLoading] = React.useState(false);

  const [source, setSource] = React.useState<SourceType>(null);

  const [hls, setHls] = React.useState(
    'https://drm-contents.doverunner.com/TEST/PACKAGED_CONTENT/TEST_SIMPLE/hls/master.m3u8',
  );
  const [doverunnerLicense, setDoverunnerLicense] = React.useState(
    'https://drm-license.doverunner.com/ri/licenseManager.do',
  );
  const [fairplayCertificate, setFairplayCertificate] = React.useState(
    'https://drm-license.doverunner.com/ri/fpsKeyManager.do?siteId=DEMO',
  );
  const [dash, setDash] = React.useState(
    'https://drm-contents.doverunner.com/TEST/PACKAGED_CONTENT/TEST_SIMPLE/dash/stream.mpd',
  );

  // ------------- DMR AuthData -------------
  // This token is used to authenticate the user and get the license
  // To run example please go to https://devconsole.doverunner.com/drm-tools/license-token/#token-generator and complete the form to receive the token
  // After you receive the token, please paste it here
  const [fairpalyAuthData, setFairPalyAuthData] = React.useState('eyJrZXlfcm90YXRpb24iOmZhbHNlLCJyZXNwb25zZV9mb3JtYXQiOiJqc29uIiwidXNlcl9pZCI6ImRvdmVydW5uZXIuVGVzdFJ1bm5lciIsImRybV90eXBlIjoiZmFpcnBsYXkiLCJzaXRlX2lkIjoiREVNTyIsImhhc2giOiJ6WEJ4VVRFREtwbkZHUXhvQlJQNUFieVFPVUFhc3NKVTg2SitScDlSaElRPSIsImNpZCI6IlRlc3RSdW5uZXIiLCJwb2xpY3kiOiI5V3FJV2tkaHB4VkdLOFBTSVljbkpzY3Z1QTlzeGd1YkxzZCthanVcL2JvbVFaUGJxSSt4YWVZZlFvY2NrdnVFZnhEY2NtN2NXZFZYcXJkTWdBUWptcVo5bzdYTEZ6MjBOaG1Kdklpd1FidWhLaCtDMmZJSEw5T3UxU09Bc2hQU0FWZHhhWVVKSnJsWjVVMXU1UGNlcjE0NVpCczdnc3ZRc0lsbDlGVHZXanQ3bWhaOHJ3ejdybVNYcURBdEdqYTRsYmVrUnhcL1pyRWx4dkJhWXV0YWFvdVlISWpkNlZpRWVXZEVpRzJIV0VIMGczcW1LYW1QbUp2VUluN0tVODZrUDQiLCJ0aW1lc3RhbXAiOiIyMDI1LTA1LTI5VDA1OjQ5OjQ0WiJ9');

  const [widevineAuthData, setWidevineAuthData] = React.useState('eyJrZXlfcm90YXRpb24iOmZhbHNlLCJyZXNwb25zZV9mb3JtYXQiOiJqc29uIiwidXNlcl9pZCI6ImRvdmVydW5uZXIuVGVzdFJ1bm5lciIsImRybV90eXBlIjoid2lkZXZpbmUiLCJzaXRlX2lkIjoiREVNTyIsImhhc2giOiJqaERXalJLRjhxRXRMeW04MTBYS2VKV0ZOYW9Da1d4Rm5lSndlZERvc2lJPSIsImNpZCI6IlRlc3RSdW5uZXIiLCJwb2xpY3kiOiI5V3FJV2tkaHB4VkdLOFBTSVljbkpzY3Z1QTlzeGd1YkxzZCthanVcL2JvbVFaUGJxSSt4YWVZZlFvY2NrdnVFZnhEY2NtN2NXZFZYcXJkTWdBUWptcVo5bzdYTEZ6MjBOaG1Kdklpd1FidWhLaCtDMmZJSEw5T3UxU09Bc2hQU0FWZHhhWVVKSnJsWjVVMXU1UGNlcjE0NVpCczdnc3ZRc0lsbDlGVHZXanQ3bWhaOHJ3ejdybVNYcURBdEdqYTRsYmVrUnhcL1pyRWx4dkJhWXV0YWFvdVlISWpkNlZpRWVXZEVpRzJIV0VIMGczcW1LYW1QbUp2VUluN0tVODZrUDQiLCJ0aW1lc3RhbXAiOiIyMDI1LTA1LTI5VDA1OjQ5OjI5WiJ9');

  const handlePlayStopVideo = () => {
    if (source !== null) {
      setSource(null);
      return;
    }

    if (fairpalyAuthData === '<USER_TOKEN>') {
      Alert.alert('Error', 'Please enter the token received from the website');
      return;
    }

    setLoading(true);

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

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text>DRM is not supported on this platform</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doverunner DRM Playback</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {source && source.uri && (
        <Video
          key={source.uri}
          onLoad={() => {
            setLoading(false);
          }}
          onError={(e) => {
            console.log('error', e);
            Alert.alert('Error', e.error.localizedDescription);
            setLoading(false);
          }}
          source={source}
          resizeMode="contain"
          style={styles.video}
          controls
          muted={false}
        />
      )}

      {Platform.OS === 'ios' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="HLS URL"
            value={hls}
            onChangeText={(text) => setHls(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Fairplay License URL"
            value={doverunnerLicense}
            onChangeText={(text) => setDoverunnerLicense(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Fairplay Certificate URL"
            value={fairplayCertificate}
            onChangeText={(text) => setFairplayCertificate(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Token"
            value={fairpalyAuthData}
            onChangeText={(text) => setFairPalyAuthData(text)}
          />
        </>
      )}

      {Platform.OS === 'android' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="DASH URL"
            value={dash}
            onChangeText={(text) => setDash(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Widevine License URL"
            value={doverunnerLicense}
            onChangeText={(text) => setDoverunnerLicense(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Token"
            value={widevineAuthData}
            onChangeText={(text) => setWidevineAuthData(text)}
          />
        </>
      )}

      <Button
        title={`${source !== null ? 'Stop' : 'Play'} Video`}
        onPress={handlePlayStopVideo}
      />
    </ScrollView>
  );
};

export default DRMExample;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 80,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: 'white',
  },
});
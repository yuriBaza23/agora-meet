import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

import agoraConfig from './configs/agora.json';

const config = {
  appId: agoraConfig.appId,
};

import {PermissionsAndroid} from 'react-native';
import api from './services/api';

/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const App = () => {
  const _engine = useRef<RtcEngine | null>(null);
  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [channel, setChannel] = useState<string>('');
  const [token, setToken] = useState<string>('');

  async function getData() {
    try {
      // Use algo parecido se não tiver uma sala
      // const channelData = await api.get('/meet/simulateChannelName');
      setChannel('d9ff16e6-b4c9-4d1e-b16c-66de79cb8847');

      // Use algo parecido para conseguir um token
      // const tokenData = await api.get(
      //   `meet/buildToken/${channelData.data.channelName}`,
      // );
      setToken(
        '006ee37ce52515f4b28b921e4bc66c150c3IAAZqDc3oofU3Rrp3z0wM3IrIZINPYZpKxxwAzMwvpQ5RLB4FIGtanHaIgB7r/NuJPKSYgQAAQCYrpFiAgCYrpFiAwCYrpFiBACYrpFi',
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }, []);

  useEffect(() => {
    /**
     * @name init
     * @description Function to initialize the Rtc Engine, attach event listeners and actions
     */
    const init = async () => {
      const {appId} = config;
      _engine.current = await RtcEngine.create(appId);
      await _engine.current.enableVideo();

      _engine.current.addListener('Warning', warn => {
        console.log('Warning', warn);
      });

      _engine.current.addListener('Error', err => {
        console.log('Error', err);
      });

      _engine.current.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          // Add peer ID to state array
          setPeerIds(prev => [...prev, uid]);
        }
      });

      _engine.current.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        // Remove peer ID from state array
        setPeerIds(prev => prev.filter(id => id !== uid));
      });

      // If Local user joins RTC channel
      _engine.current.addListener(
        'JoinChannelSuccess',
        (channelName, uid, elapsed) => {
          console.log('JoinChannelSuccess', channelName, uid, elapsed);
          // Set state variable to true
          setJoined(true);
        },
      );
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @name startCall
   * @description Function to start the call
   */
  const startCall = async () => {
    // Join Channel using null token and channel name
    await _engine.current?.joinChannel(token, channel, null, 17345739);
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  const endCall = async () => {
    await _engine.current?.leaveChannel();
    setPeerIds([]);
    setJoined(false);
  };

  const _renderVideos = () => {
    return isJoined ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channel}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={styles.padding}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channel}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={startCall} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {_renderVideos()}
      </View>
    </View>
  );
};

export default App;

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  padding: {
    paddingHorizontal: 2.5,
  },
});

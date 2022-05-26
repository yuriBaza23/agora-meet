import React, {useEffect} from 'react';
import {Alert, PermissionsAndroid, Platform, View} from 'react-native';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcEngineContext,
} from 'react-native-agora';
import {buildTokenWithUid, simulateChannelName} from '../configs/agora';

const agoraConfig = require('../configs/agora.json');

const App = () => {
  let engine = new RtcEngine() || undefined;

  async function initEngine(engineParameter: RtcEngine) {
    engineParameter = await RtcEngine.createWithContext(
      new RtcEngineContext(agoraConfig.appId),
    );
    await engineParameter.enableVideo();
    await engineParameter.startPreview();
    await engineParameter.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await engineParameter.setClientRole(ClientRole.Broadcaster);
    Alert.alert('Sala de video conferência', 'Carregando...');

    // Pegar nome da sua sala por api se não for padrão na linha abaixo.
    let channelName = simulateChannelName();

    // O token é extremamente necessário. Campos necessários na configuração: AppID, AppCertificate
    let tokenChannel = await buildTokenWithUid(channelName);

    await joinChannel(engineParameter, channelName, tokenChannel);
    Alert.alert('Sala de video conferência', 'Você entrou na sala');
  }

  async function joinChannel(
    engineParameter: RtcEngine,
    channel: string,
    token: string,
  ) {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    await engineParameter.joinChannel(token, channel, null, 0);
  }

  async function renderVideo() {
    return <View />;
  }

  useEffect(() => {
    initEngine(engine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View />;
};

export default App;

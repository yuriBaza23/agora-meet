import {v4 as uuidv4} from 'uuid';
import {RtcTokenBuilder, RtcRole} from 'agora-access-token';
import agoraConfig from '../../../../app/src/configs/agora.json';

const appID = agoraConfig.appId;
const appCertificate = agoraConfig.appCertificate;
const role = RtcRole.PUBLISHER;

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function simulateChannelName() {
  return uuidv4();
}

export function buildTokenWithUid(channelName: string) {
  let uid = getRandomInt(10000000, 99999999);
  const tokenA = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );
  return {token: tokenA, uid};
}

// Build token with user account
// const tokenB = RtcTokenBuilder.buildTokenWithAccount(
//   appID,
//   appCertificate,
//   channelName,
//   account,
//   role,
//   privilegeExpiredTs,
// );
// console.log('Token With UserAccount: ' + tokenB);

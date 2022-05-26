import {uuid} from 'uuidv4';
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const agoraConfig = require('./agora.json');

const appID = agoraConfig.appId;
const appCertificate = agoraConfig.appCertificate;
const role = RtcRole.PUBLISHER;
//const account = '2882341273';

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function simulateChannelName() {
  return uuid();
}

export async function buildTokenWithUid(channelName: string) {
  let uid = getRandomInt(10000000, 99999999);
  const tokenA = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );
  console.log('Token With Integer Number Uid: ' + tokenA);
  return tokenA;
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

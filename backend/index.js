const express = require('express');
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const faunadb = require("faunadb");
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

require('dotenv').config({ path: './.env.local' })

const q = faunadb.query;

const app = express();
app.use(cors());

app.use(express.json());

const client = new faunadb.Client({
  secret: process.env.FAUNADB_KEY,
});

function simulateChannelName(){
  return uuidv4();
}

async function getRandomInt(min, max) {
  let minValue = min;
  let maxValue = max;
  minValue = Math.ceil(min);
  maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

async function buildTokenWithUid(channelName) {
  const appID = process.env.APP_ID;
  const appCertificate = process.env.APP_CERT;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 429496729;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const uid = await getRandomInt(10000000, 99999999);
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return { token, uid };
}

async function searchChannel(channelName) {
  const channel = await client.query(
    q.If(
      q.Exists(q.Match(q.Index("channel_by_name"), q.Casefold(channelName))),
      q.Get(q.Match(q.Index("channel_by_name"), q.Casefold(channelName))),
      null
    )
  );
  if (channel !== null) {
    return channel.data;
  }

  return null;
}

async function createChannelAndToken(
  channelName,
  tokenI,
  tokenII,
  professional,
  clientId,
  puid,
  cuid,
) {
  await client.query(
    q.Create(q.Collection("meet_channels"), {
      data: {
        channelName,
        env: {
          [professional]: {
            uid: puid,
            token: tokenI
          },
          [clientId]: {
            uid: cuid,
            token: tokenII
          },
        },
        admin: professional,
        [professional]: {
          access: '',
          exit: '',
        },
        [clientId]: {
          access: '',
          exit: '',
        },
        maxUsers: 2
      },
    })
  );
}

async function createTokenMeet({ channel, me, user2 }) {
  const channelExist = await searchChannel(channel); // check if channel exist

  if(channelExist) {
    const iCan = channelExist.env && channelExist.env[me];
    if(iCan) {
      return channelExist;
    }

    throw new Error('You are not allowed to join this channel');
  }

  const tokenI = await buildTokenWithUid(channel);
  const tokenII = await buildTokenWithUid(channel);

  await createChannelAndToken(
    channel,
    tokenI.token,
    tokenII.token,
    me,
    user2 || uuidv4(),
    tokenI.uid,
    tokenII.uid
  );

  const data = searchChannel(channel);
  return data;
}

async function updateInformations({ channel, me, type }) {
  const channelExist = await searchChannel(channel); // check if channel exist

  if(channelExist) {
    const iCan = channelExist.env && channelExist.env[me];
    if(iCan) {
      const ref = await client.query(
        q.Get(
          q.Match(
            q.Index("channel_by_name"), 
            q.Casefold(channel)
          )
        )
      )
    
      try {
        await client.query(
          q.Update(
            q.Ref(q.Collection('meet_channels'), ref.ref.id),
            {
              data: {
                [me]: {
                  access: type === 'access' ? q.Now() : channelExist[me].access,
                  exit: type === 'exit' ? q.Now() : '',
                }
              }
            }
          )
        )

        return;
      } catch (error) {
        throw new Error(error);
      }
    }

    throw new Error('You are not allowed to join this channel');
  }
}

async function addParticipants({ participants, channel, me }) {
  const channelExist = await searchChannel(channel); // check if channel exist

  if(channelExist) {
    const iCan = channelExist.env && channelExist.env[me];
    if(iCan && channelExist.admin === me) {
      const newData = channelExist;
    
      var participantsNumber = 0;
      while(participantsNumber < participants.length) {
        const token = await buildTokenWithUid(channel);
        const uid = token.uid;
    
        newData.env[participants[participantsNumber]] = uid;
        newData[participants[participantsNumber]] = {
          access: '',
          exit: '',
        }
    
        participantsNumber++;
      }

      const ref = await client.query(
        q.Get(
          q.Match(
            q.Index("channel_by_name"), 
            q.Casefold(channel)
          )
        )
      )

      try {
        await client.query(
          q.Replace(
            q.Ref(q.Collection('meet_channels'), ref.ref.id),
            { data: newData }
          )
        )

        return;
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error('You don\'t have permission to do this');
    }
  }

  const channelExistII = await searchChannel(channel);
  return channelExistII;
}

app.get("/test/meet/simulateChannelName", async (req, res) => {
  const channel = simulateChannelName();

  return res.status(200).json({ channelName: channel });
});

app.post("/meet/buildToken/:channelName/:me", async (req, res) => {
  const { channelName, me } = req.params;
  const { user2 } = req.body;

  const token = await createTokenMeet({ channel: channelName, me, user2 });

  return res.status(200).json(token);
});

app.post("/meet/informations/:channelName/:me/:type", async (req, res) => {
  const { channelName, me, type } = req.params;

  await updateInformations({ channel: channelName, me, type });

  return res.status(201).json();
});

app.post("/meet/addParticipants/:channelName/:me", async (req, res) => {
  const { channelName, me } = req.params;

  await addParticipants({ participants: req.body.participants, channel: channelName, me });

  return res.status(201).json();
});

app.listen(3333, () => console.log("Okay, tudo certo na 3333"));
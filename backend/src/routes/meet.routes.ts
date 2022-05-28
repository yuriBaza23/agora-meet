import {Router} from 'express';

import {CreateTokenMeetController} from '../modules/meet/useCases/CreateTokenMeet/CreateTokenMeetController';
import {SimulateChannelNameController} from '../modules/meet/useCases/SimulateChannelName/SimulateChannelNameController';

const meetRoutes = Router();

const createTokenMeetController = new CreateTokenMeetController();
const simulateChannelNameController = new SimulateChannelNameController();

meetRoutes.get('/buildToken/:channel', (request, response) => {
  return createTokenMeetController.handle(request, response);
});

meetRoutes.get('/simulateChannelName', (request, response) => {
  return simulateChannelNameController.handle(request, response);
});

export {meetRoutes};

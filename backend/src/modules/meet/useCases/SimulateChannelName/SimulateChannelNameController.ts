import { Request, Response } from "express";

import { SimulateChannelNameUseCase } from "./SimulateChannelNameUseCase";

class SimulateChannelNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const simulateChannelNameUseCase = new SimulateChannelNameUseCase();
    const channel = await simulateChannelNameUseCase.execute();

    return response.status(200).json({ channelName: channel });
  }
}

export { SimulateChannelNameController };

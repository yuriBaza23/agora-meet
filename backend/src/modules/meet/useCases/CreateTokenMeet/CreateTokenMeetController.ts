import { Request, Response } from "express";

import { CreateTokenMeetUseCase } from "./CreateTokenMeetUseCase";

class CreateTokenMeetController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { channel } = request.params;
    const createTokenMeetUseCase = new CreateTokenMeetUseCase();
    const token = await createTokenMeetUseCase.execute(channel);

    return response.status(200).json(token);
  }
}

export { CreateTokenMeetController };

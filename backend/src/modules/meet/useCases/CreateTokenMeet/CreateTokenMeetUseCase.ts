import { buildTokenWithUid } from "../../../../shared/providers/agora";

interface IResponse {
  token: string;
  uid: number;
}

class CreateTokenMeetUseCase {
  async execute(channelName: string): Promise<IResponse> {
    const token = buildTokenWithUid(channelName);
    return token;
  }
}

export { CreateTokenMeetUseCase };

import { simulateChannelName } from "../../../../shared/providers/agora";

class SimulateChannelNameUseCase {
  async execute(): Promise<string> {
    const channelName = simulateChannelName();
    console.log(channelName);
    return channelName;
  }
}

export { SimulateChannelNameUseCase };

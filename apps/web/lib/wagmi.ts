import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { galileo } from "./chain";

export const wagmiConfig = createConfig({
  chains: [galileo],
  connectors: [injected()],
  transports: {
    [galileo.id]: http(),
  },
});

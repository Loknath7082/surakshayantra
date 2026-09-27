import { Shield, Globe, Smartphone, Plug, Network, type LucideIcon } from "lucide-react";
import type { ServiceIconName } from "./services-data";

export const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  shield: Shield,
  globe: Globe,
  smartphone: Smartphone,
  plug: Plug,
  network: Network,
};

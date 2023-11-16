import { NS } from "@ns";
import { getPwndServers, getScanScriptArgs } from "/util";

export async function main(ns: NS): Promise<void> {
  const args = getScanScriptArgs(ns);
  const targets = args.targets ?? getPwndServers(ns)

  const counts = calculateFleetThreads(ns, targets);
  ns.tprint(`${counts.used} are free for use out of ${counts.max} maximum threads to run weaken() and grow()`)
}

interface FleetThreadCount {
  used: number;
  max: number;
}

export function calculateFleetThreads(ns: NS, targets: string[]): FleetThreadCount {
  const memCost = Math.max(ns.getScriptRam("weaken.js"), ns.getScriptRam("grow.js"))
  const threadsMax = targets
      .map(hostname => ns.getServerMaxRam(hostname))
      .map(ram => Math.floor(ram / memCost))
      .reduce((a, b) => a + b, 0)
  const threadsActual = targets
      .map(hostname => ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname))
      .map(ram => Math.floor(ram / memCost))
      .reduce((a, b) => a + b, 0)

  return {
    used: threadsActual,
    max: threadsMax
  }
}
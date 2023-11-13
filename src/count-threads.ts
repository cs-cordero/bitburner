import { NS } from "@ns";
import { getPwndServers, isNumber } from "/util";

export async function main(ns: NS): Promise<void> {
  const memCost = Math.max(ns.getScriptRam("weaken.js"), ns.getScriptRam("grow.js"))
  const threadsMax = getPwndServers(ns)
      .map(hostname => ns.getServerMaxRam(hostname))
      .map(ram => Math.floor(ram / memCost))
      .reduce((a, b) => a + b, 0)
  const threadsActual = getPwndServers(ns)
      .map(hostname => ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname))
      .map(ram => Math.floor(ram / memCost))
      .reduce((a, b) => a + b, 0)
  ns.tprint(`${threadsActual} are free for use out of ${threadsMax} maximum threads to run weaken() and grow()`)
}
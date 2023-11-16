import { NS } from "@ns";
import { calculateFleetThreads } from "/calc-threads";
import { getPwndServers } from "/util";

export async function main(ns: NS): Promise<void> {
  const fleet = calculateFleetThreads(ns, getPwndServers(ns))
  const threadsToUse = Math.floor(fleet.max * 0.9)
  const totalServerCount = getPwndServers(ns)
      .filter(server => !ns.getPurchasedServers().includes(server))
      .filter(server => server !== "home")
      .length
  const hostsToTarget = Math.min(totalServerCount, Math.max(Math.floor(threadsToUse / 2000), 2))

  const args = ns.args.includes("--silent") ? ["--silent"] : []
  ns.run("ai-weaken.js", undefined, ...args)
  ns.run("ai-grow.js", undefined, threadsToUse, hostsToTarget, ...args)
  ns.run("ai-hack.js")
  ns.run("calc-exprate.js")
}
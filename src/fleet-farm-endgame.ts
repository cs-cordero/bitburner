import { NS } from "@ns"
import { getTargetableServers } from "/lib/util";
import { getFleetThreadManifest } from "/lib/threads";

export async function main(ns: NS): Promise<void> {
    const fleetThreads = getFleetThreadManifest(ns)
    const maxServersToFarm = Math.floor(fleetThreads.max / 4400)
    if (maxServersToFarm === 0) {
        ns.tprint("Not enough fleet threads to farm.")
        return
    }

    const servers = getTargetableServers(ns)
        .sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a))
        .filter(server => ns.getServerMaxMoney(server) > 0)
        .slice(0, maxServersToFarm)

    for (const server of servers) {
        ns.run("fleet-farm.js", undefined, server, "--silent")
    }
}
import { NS } from "@ns"
import { getFleetThreadManifest, getPwndServers } from "/lib/util";

export async function main(ns: NS): Promise<void> {
    const fleetThreads = getFleetThreadManifest(ns)
    const maxServersToFarm = Math.floor(fleetThreads.fleetThreadsMax / 4400)
    if (maxServersToFarm === 0) {
        ns.tprint("Not enough fleet threads to farm.")
        return
    }

    const pwndServers = getPwndServers(ns)
        .filter(server => !server.startsWith("home"))
        .sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a))
        .filter(server => ns.getServerMaxMoney(server) > 0)
        .slice(0, maxServersToFarm)

    for (const server of pwndServers) {
        ns.run("fleet-farm.js", undefined, server, "--silent")
    }
}
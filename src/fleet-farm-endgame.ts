import { NS } from "@ns"
import { formulasApiActive, getTargetableServers } from "/lib/util"
import { getFleetThreadManifest } from "/lib/threads"

export async function main(ns: NS): Promise<void> {
    const fleetThreads = getFleetThreadManifest(ns)
    const maxServersToFarm = Math.floor(fleetThreads.max / 4400)
    if (maxServersToFarm === 0) {
        ns.tprint("Not enough fleet threads to farm.")
        return
    }

    const servers = getTargetableServers(ns)
        .sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a))
        .filter((server) => ns.getServerMaxMoney(server) > 0)
        .filter((server) => {
            if (formulasApiActive(ns)) {
                const serverData = ns.getServer(server)
                serverData.hackDifficulty = serverData.minDifficulty!
                const hackChance = ns.formulas.hacking.hackChance(serverData, ns.getPlayer())
                return hackChance >= 0.9
            } else {
                return true
            }
        })
        .slice(0, maxServersToFarm)

    for (const server of servers) {
        ns.run("fleet-farm.js", undefined, server, "--silent")
    }
}

import { NS } from "@ns"
import {
    formulasApiActive,
    getPrintFunc,
    getTargetableServers,
    parseArguments,
    PositionalArgType,
    ScriptArguments,
    ScriptArgumentsSpec
} from "/lib/util"
import { getFleetThreadManifest } from "/lib/threads"

export async function main(ns: NS): Promise<void> {
    const args = getArgs(ns)
    const print = getPrintFunc(ns, args.silent)

    const fleetThreads = getFleetThreadManifest(ns)
    const maxServersToFarm = Math.floor(fleetThreads.max / args.threads)
    if (maxServersToFarm === 0) {
        print("Not enough fleet threads to farm.")
        return
    }

    const servers = getTargetableServers(ns)
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
        .sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a))
        .slice(0, maxServersToFarm)

    for (const server of servers) {
        ns.run("fleet-farm.js", undefined, server, args.threads, "--silent")
    }
}

type ArgumentNames = "threads" | "silent"
const ArgsSpec: ScriptArgumentsSpec<ArgumentNames> = {
    threads: {
        type: "POSITIONAL",
        argType: PositionalArgType.Number,
        position: 0,
        optional: false,
    },
    silent: { type: "FLAG" },
}
interface Args extends ScriptArguments<ArgumentNames> {
    threads: number
    silent: boolean
}
function getArgs(ns: NS): Args {
    return parseArguments<
        ArgumentNames,
        never,
        typeof ArgsSpec,
        Args
    >(ns, ArgsSpec)
}
import { NS } from "@ns"
import { getScanScriptArgs, getTargetableServers } from "/lib/util";

export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)

    const servers = args.targets ?? getTargetableServers(ns)
        .sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a))
        .slice(0, 10)

    servers.forEach(server => ns.run("farm.js", undefined, server))
}

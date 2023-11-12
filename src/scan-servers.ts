import { NS } from "@ns";
import { getAllServers, getPrintFunc, getScanScriptArgs } from "/util";

interface ServerInfo {
    hostname: string;
    reqHackingLevel: number;
    reqPorts: number;
}

/**
 * Prints the requirements for running NUKE.exe on certain servers, by default these are only the servers that
 * are missing root access.
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const hostnamesToEvaluate = args.targets ?? getAllServers(ns)
        .filter(hostname => !ns.hasRootAccess(hostname))
    const print = getPrintFunc(ns)

    const info: ServerInfo[] = []
    for (const hostname of hostnamesToEvaluate) {
        const reqHackingLevel = ns.getServerRequiredHackingLevel(hostname)
        const reqPorts = ns.getServerNumPortsRequired(hostname)
        info.push( { hostname, reqHackingLevel, reqPorts })
    }

    info.sort((a, b) => {
        if (a.reqHackingLevel === b.reqHackingLevel) {
            return a.reqPorts - b.reqPorts
        } else {
            return a.reqHackingLevel - b.reqHackingLevel
        }
    })

    print("Server vulnerability information")
    for (const datum of info) {
        const hostname = datum.hostname.padEnd(18)
        const reqLevel = datum.reqHackingLevel.toString().padStart(4)
        print(`    ${hostname} Hacking Level: ${reqLevel} Ports: ${datum.reqPorts}`)
    }
}
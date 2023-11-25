import { NS } from "@ns"
import { getAllServers, getPrintFunc, getScanScriptArgs } from "/lib/util"

interface ServerInfo {
    hostname: string
    reqHackingLevel: number
    reqPorts: number
}

/**
 * Prints the requirements for running NUKE.exe on certain servers, by default these are only the servers that
 * are missing root access.
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const hostnamesToEvaluate =
        args.targets ??
        getAllServers(ns).filter((hostname) => !ns.hasRootAccess(hostname))
    const print = getPrintFunc(ns)

    const info: ServerInfo[] = []
    for (const hostname of hostnamesToEvaluate) {
        const reqHackingLevel = ns.getServerRequiredHackingLevel(hostname)
        const reqPorts = ns.getServerNumPortsRequired(hostname)
        info.push({ hostname, reqHackingLevel, reqPorts })
    }

    info.sort((a, b) => {
        if (a.reqHackingLevel === b.reqHackingLevel) {
            return a.reqPorts - b.reqPorts
        } else {
            return a.reqHackingLevel - b.reqHackingLevel
        }
    })

    let infoToShow;
    if (ns.args.includes("--all")) {
        infoToShow = info
    } else if (ns.args.includes("--all-future")) {
        infoToShow = info.filter(inf => !ns.hasRootAccess(inf.hostname))
    } else {
        infoToShow = info.filter(inf => !ns.hasRootAccess(inf.hostname) && inf.reqHackingLevel - ns.getHackingLevel() <= 100)
    }

    print("Server vulnerability information")
    for (const datum of infoToShow) {
        if (
            !ns.args.includes("--all") &&
            datum.reqHackingLevel - ns.getHackingLevel() > 100
        ) {
            continue
        }
        const hostname = datum.hostname.padEnd(18)
        const reqLevel = datum.reqHackingLevel.toString().padStart(4)
        print(
            `    ${hostname} Hacking Level: ${reqLevel} Ports: ${datum.reqPorts}`
        )
    }
}

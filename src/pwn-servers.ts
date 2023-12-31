import { NS } from "@ns"
import { getAllServers, getMultiTargetArgs, getPrintFunc } from "/lib/util"

/**
 * Runs NUKE.exe on any servers for which we can pwn.
 */
export async function main(ns: NS): Promise<void> {
    const args = getMultiTargetArgs(ns)
    const print = getPrintFunc(ns, args.silent)

    const hostnames = args.targets.length ? args.targets : getNukableHosts(ns)
    if (!hostnames.length) {
        print("We can't NUKE.exe any new servers.")
        const remaining = getAllServers(ns).filter(hostname => !ns.hasRootAccess(hostname)).length
        if (remaining === 0) {
            print(`...and so he wept, for there were no more worlds left to conquer.`)
        } else {
            print(`${remaining} remaining hosts to nuke in the network.`)
        }
        return
    }

    const programs = getVulnerabilityPrograms(ns)
    for (const hostname of hostnames) {
        programs.forEach((program) => program(hostname))
        ns.nuke(hostname)
        print(`${hostname} has been pwned!`)
    }
}

function getNukableHosts(ns: NS) {
    const programs = getVulnerabilityPrograms(ns)

    return (
        getAllServers(ns)
            // we don't have root access to it yet
            .filter((hostname) => !ns.hasRootAccess(hostname))
            // we can hack it
            .filter((hostname) => ns.getServerRequiredHackingLevel(hostname) <= ns.getHackingLevel())
            // we can open enough ports
            .filter((hostname) => ns.getServerNumPortsRequired(hostname) <= programs.length)
    )
}

function getVulnerabilityPrograms(ns: NS) {
    const programs: ((hostname: string) => void)[] = []

    ns.fileExists("BruteSSH.exe", "home") && programs.push(ns.brutessh)
    ns.fileExists("FTPCrack.exe", "home") && programs.push(ns.ftpcrack)
    ns.fileExists("relaySMTP.exe", "home") && programs.push(ns.relaysmtp)
    ns.fileExists("HTTPWorm.exe", "home") && programs.push(ns.httpworm)
    ns.fileExists("SQLInject.exe", "home") && programs.push(ns.sqlinject)

    return programs
}

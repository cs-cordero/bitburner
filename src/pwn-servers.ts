import { NS } from "@ns";
import { getAllServers, getPrintFunc, getScanScriptArgs } from "/util";

/**
 * Runs NUKE.exe on any servers for which we can pwn.
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const print = getPrintFunc(ns)

    const programs: ((hostname: string) => void)[] = []
    ns.fileExists("BruteSSH.exe", "home") && programs.push(ns.brutessh)
    ns.fileExists("FTPCrack.exe", "home") && programs.push(ns.ftpcrack)
    ns.fileExists("relaySMTP.exe", "home") && programs.push(ns.relaysmtp)
    ns.fileExists("HTTPWorm.exe", "home") && programs.push(ns.httpworm)
    ns.fileExists("SQLInject.exe", "home") && programs.push(ns.sqlinject)

    const hostnames = args.targets ?? getAllServers(ns)
        .filter(hostname => !ns.hasRootAccess(hostname)) // we don't have root access to it yet
        .filter(hostname => ns.getServerRequiredHackingLevel(hostname) <= ns.getHackingLevel()) // we can hack it
        .filter(hostname => ns.getServerNumPortsRequired(hostname) <= programs.length) // we can open enough ports

    if (!hostnames.length) {
        print("We can't NUKE.exe any new servers.")
        return
    }

    for (const hostname of hostnames) {
        programs.forEach(program => program(hostname))
        ns.nuke(hostname)
        print(`${hostname} has been pwned!`)
    }
}
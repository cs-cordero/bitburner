import { NS } from "@ns";
import { formatPct, getPrintFunc, getPwndServers, getScanScriptArgs, round } from "/util";

interface SecurityLevel {
    hostname: string;
    currentLevel: number;
    minLevel: number;
    growthRate: number;
    timeHack: number;
    timeGrow: number;
    timeWeaken: number;
}

/**
 * Prints the security level information (and some hack time info) for all pwnd servers.
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const print = getPrintFunc(ns)

    const hostnames = args.targets ?? getPwndServers(ns)
        .filter(hostname => !ns.getPurchasedServers().includes(hostname))
        .filter(hostname => hostname !== "home");

    const data: SecurityLevel[] = [];
    for (const hostname of hostnames) {
        const currentLevel = ns.getServerSecurityLevel(hostname)
        const minLevel = ns.getServerMinSecurityLevel(hostname)
        const growthRate = ns.getServerGrowth(hostname);
        const timeHack = ns.getHackTime(hostname);
        const timeGrow = ns.getGrowTime(hostname);
        const timeWeaken = ns.getWeakenTime(hostname);
        data.push({ hostname, currentLevel, minLevel, growthRate, timeHack, timeGrow, timeWeaken })
    }

    data.sort((a, b) => a.currentLevel - b.currentLevel);

    print("Security Level Information")
    for (const datum of data) {
        const secLevel = round(datum.currentLevel, 2)

        if (args.printDetailedInfo) {
            const timeHack = round(datum.timeHack / 1000, 3)
            const timeGrow = round(datum.timeGrow / 1000, 3)
            const timeWeaken = round(datum.timeWeaken / 1000, 3)

            print(`${datum.hostname}`);
            print(`\tCurrent Security Level: ${secLevel} (Min: ${datum.minLevel})`)
            print(`\tServer Growth Rate: ${formatPct(datum.growthRate)}`)
            print(`\tHack Time: ${timeHack.toFixed(3)}s`)
            print(`\tGrow Time: ${timeGrow.toFixed(3)}s`)
            print(`\tWeaken Time: ${timeWeaken.toFixed(3)}s`)
            print(`\tSec Level Increases by ${0.004 / timeGrow} per second.`)
            print(`\tSec Level Decreases by ${0.05 / timeWeaken} per second.`)
            print(`\tThere should be 1 Weaken thread for every ${Math.floor((0.05 / timeWeaken) / (0.004 / timeGrow))} Grow thread.`)
        } else {
            const padHostname = datum.hostname.padEnd(18)
            const padSecLevel = `${secLevel}`.padStart(7)
            const padMinLevel = `${datum.minLevel}`.padStart(2)
            print(`\t${padHostname} ${padSecLevel} (Min: ${padMinLevel})`)
        }
    }
}
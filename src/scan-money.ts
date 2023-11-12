import { NS } from "@ns";
import {
    formatNumber,
    formatPct,
    getPrintFunc,
    getPwndServers,
    getScanScriptArgs,
    round
} from "/util";

interface MoneyInfo {
    hostname: string;
    currentAmount: number;
    maxAmount: number;
    growthParam: number;
    timeGrow: number;
}

/**
 * Prints the money information for all pwnd servers.
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const print = getPrintFunc(ns)

    const hostnames = args.targets ?? getPwndServers(ns)
        .filter(hostname => !ns.getPurchasedServers().includes(hostname))
        .filter(hostname => hostname !== "home");

    const moneyInfo: MoneyInfo[] = [];
    for (const hostname of hostnames) {
        const currentAmount = ns.getServerMoneyAvailable(hostname)
        const maxAmount = ns.getServerMaxMoney(hostname)
        const growthParam = ns.getServerGrowth(hostname)
        const timeGrow = ns.getGrowTime(hostname)
        moneyInfo.push({ hostname, currentAmount, maxAmount, growthParam, timeGrow });
    }

    moneyInfo.sort((a, b) => b.currentAmount - a.currentAmount)

    print("Money Level Information");
    for (const datum of moneyInfo) {
        const { hostname } = datum
        const current = formatNumber(datum.currentAmount);
        const max = formatNumber(datum.maxAmount);
        const pct = formatPct(datum.currentAmount / datum.maxAmount * 100);

        let s = "    "
        s += `${hostname}:`.padEnd(18)
        s += " "
        s += pad(current)
        s += " / "
        s += pad(max)
        s += `(${pct}%)`.padStart(9)

        if (args.printDetailedInfo) {
            const growthParam = datum.growthParam;
            const growthPerSecond = round((datum.growthParam / (datum.timeGrow / 1000)), 4)
            s +=  ` Growth Param: ${growthParam} (${growthPerSecond}/s)`
        }

        print(s)
    }
}
function pad(x: string): string {
    if (x.endsWith("b") || x.endsWith("m") || x.endsWith("k")) {
        return x.padStart(8)
    } else {
        return `${x.padStart(7)} `
    }
}
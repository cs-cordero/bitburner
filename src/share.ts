import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    if (ns.args.includes("--check")) {
        ns.tprint(ns.getSharePower())
    } else {
        while (true) {
            await ns.share()
        }
    }
}

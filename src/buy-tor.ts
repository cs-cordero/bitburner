import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.singularity.purchaseTor()
    // const infiltrationLocs = ns.infiltration.getPossibleLocations()
    //     .map(loc => ns.infiltration.getInfiltration(loc.name))

    // infiltrationLocs
    //     .sort((a, b) => {
    //         if (a.difficulty === b.difficulty) {
    //             return b.reward.tradeRep - a.reward.tradeRep
    //         } else {
    //             return a.difficulty - b.difficulty
    //         }
    //     })
    //     .forEach(loc => {
    //         ns.tprint(`${loc.location.name} (${loc.location.city}): ${formatNumber(loc.difficulty, false)} ${formatNumber(loc.reward.tradeRep, false)}`)
    //     })
}

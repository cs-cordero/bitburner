import { NS } from "@ns"
import { getImplantsFromFactions, ImplantEffect } from "/lib/implant-analysis";

export async function main(ns: NS): Promise<void> {
    const factionToImplants = getImplantsFromFactions(ns)
    const flattenedImplants = Object.entries(factionToImplants)
        .flatMap(([faction, implants]) => implants
            .map(implant => {
                return {
                    faction,
                    ...implant
                }
            })
        )

    const importantEffects = [
        // ImplantEffect.Hacking,
        // ImplantEffect.HackingExp,
        // ImplantEffect.HackingChance,
        // ImplantEffect.HackingMoney,
        // ImplantEffect.Speed,
        // ImplantEffect.Grow,
        // ImplantEffect.FactionRep,
        // ImplantEffect.CompanyRep,
        // ImplantEffect.All,
        // ImplantEffect.AllExp,

        ImplantEffect.Charisma,
        ImplantEffect.CharismaExp,
    ]

    const importantImplants = flattenedImplants
        .filter(implant => implant
            .effects
            .filter(effect => importantEffects.includes(effect)).length > 0
        )

    const implantNameToImplant: { [name: string]: typeof importantImplants } = {}
    for (const implant of importantImplants) {
        if (implantNameToImplant[implant.name] === undefined) {
            implantNameToImplant[implant.name] = []
        }

        implantNameToImplant[implant.name].push(implant)
    }

    const myAugmentations = ns.singularity.getOwnedAugmentations(true)
    for (const [implant, data] of Object.entries(implantNameToImplant).sort((a, b) => a[1][0].rep - b[1][0].rep)) {
        if (myAugmentations.includes(implant)) {
            continue
        }
        const factions = data.map(datum => datum.faction).sort().join(",")
        const price = ns.formatNumber(data[0].price, 3)
        const rep = ns.formatNumber(data[0].rep, 3)
        ns.tprint(`${implant}: $${price} ${rep} rep`)
        ns.tprint(`    ${factions}`)
    }
}

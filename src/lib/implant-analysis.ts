import { Multipliers, NS } from "@ns"
import { getPrintFunc } from "/lib/util"

export interface Implant {
    name: string
    unique: boolean
    price: number
    rep: number
    effects: ImplantEffect[]
}

export enum ImplantEffect {
    Hacking = "HACK",
    Strength = "STR",
    Defense = "DEF",
    Dexterity = "DEX",
    Agility = "AGI",
    Charisma = "CHA",

    HackingExp = "HACK_EXP",
    StrengthExp = "STR_EXP",
    DefenseExp = "DEF_EXP",
    DexterityExp = "DEX_EXP",
    AgilityExp = "AGI_EXP",
    CharismaExp = "CHA_EXP",

    HackingChance = "HACK_CHANCE",
    HackingMoney = "HACK_MONEY",
    Speed = "SPEED",
    Grow = "GROW",

    WorkMoney = "COMPANY_MONEY",
    HacknetMoney = "HACKNET",

    FactionRep = "FACTION_REP",
    CompanyRep = "COMPANY_REP",

    CrimeMoney = "CRIME_MONEY",
    CrimeChance = "CRIME_CHANCE",

    Combat = "COMBAT",
    CombatExp = "COMBAT_EXP",
    All = "ALL",
    AllExp = "ALL_EXP",
}
const NEUROFLUX_GENERATOR = "NeuroFlux Governor"
const FACTIONS = [
    "CyberSec",
    "Tian Di Hui",
    "Netburners",
    "Shadows of Anarchy",
    "Sector-12",
    "Chongqing",
    "New Tokyo",
    "Ishima",
    "Aevum",
    "Volhaven",
    "NiteSec",
    "The Black Hand",
    "BitRunners",
    "ECorp",
    "MegaCorp",
    "KuaiGong International",
    "Four Sigma",
    "NWO",
    "Blade Industries",
    "OmniTek Incorporated",
    "Bachman & Associates",
    "Clarke Incorporated",
    "Fulcrum Secret Technologies",
    "Slum Snakes",
    "Tetrads",
    "Silhouette",
    "Speakers for the Dead",
    "The Dark Army",
    "The Syndicate",
    "Daedalus",
]
const COMBAT_SKILLS = [ImplantEffect.Strength, ImplantEffect.Defense, ImplantEffect.Dexterity, ImplantEffect.Agility]
const COMBAT_EXP_SKILLS = [
    ImplantEffect.StrengthExp,
    ImplantEffect.DefenseExp,
    ImplantEffect.DexterityExp,
    ImplantEffect.AgilityExp,
]
const ALL_SKILLS = [
    ImplantEffect.Strength,
    ImplantEffect.Defense,
    ImplantEffect.Dexterity,
    ImplantEffect.Agility,
    ImplantEffect.Hacking,
    ImplantEffect.Charisma,
]
const ALL_EXP_SKILLS = [
    ImplantEffect.StrengthExp,
    ImplantEffect.DefenseExp,
    ImplantEffect.DexterityExp,
    ImplantEffect.AgilityExp,
    ImplantEffect.HackingExp,
    ImplantEffect.CharismaExp,
]

export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const factionToImplants = getImplantsFromFactions(ns)

    for (const [faction, implants] of Object.entries(factionToImplants)) {
        print(`#### ${faction}`)
        for (const implant of implants) {
            const name = implant.name
            const unique = implant.unique ? "[!] " : ""
            const price = ns.formatNumber(implant.price, 3)
            const rep = ns.formatNumber(implant.rep, 3)
            const stats = implant.effects.join(",")

            print(`  * ${name} ${unique}(${stats}) price: ${price} rep: ${rep}`)
        }

        print("")
    }
}

export function getImplantsFromFactions(ns: NS): { [faction: string]: Implant[] } {
    const result: { [faction: string]: Implant[] } = {}

    for (const faction of FACTIONS) {
        const implants: Implant[] = ns.singularity
            .getAugmentationsFromFaction(faction)
            .filter((implant) => implant !== NEUROFLUX_GENERATOR)
            .map((implant) => {
                const price = ns.singularity.getAugmentationBasePrice(implant)
                const rep = ns.singularity.getAugmentationRepReq(implant)
                const isUnique = ns.singularity.getAugmentationFactions(implant).length === 1
                const stats = [...convertMultipliers(ns.singularity.getAugmentationStats(implant))].sort((a, b) =>
                    a.localeCompare(b)
                )

                return {
                    name: implant,
                    price,
                    rep,
                    unique: isUnique,
                    effects: stats,
                }
            })
            .sort((a, b) => {
                if (a.unique && !b.unique) {
                    return -1
                } else if (!a.unique && b.unique) {
                    return 1
                } else if (a.rep === b.rep) {
                    return a.name.localeCompare(b.name)
                } else {
                    return a.rep - b.rep
                }
            })

        result[faction] = implants
    }

    return result
}

function convertMultipliers(multipliers: Multipliers): Set<ImplantEffect> {
    const effects: ImplantEffect[] = Object.entries(multipliers)
        .filter(([, value]) => value > 1)
        .map(([multiplier]) => multiplier)
        .map((raw) => {
            switch (raw) {
                case "strength":
                    return ImplantEffect.Strength
                case "defense":
                    return ImplantEffect.Defense
                case "dexterity":
                    return ImplantEffect.Dexterity
                case "agility":
                    return ImplantEffect.Agility
                case "charisma":
                    return ImplantEffect.Charisma
                case "strength_exp":
                    return ImplantEffect.StrengthExp
                case "defense_exp":
                    return ImplantEffect.DefenseExp
                case "dexterity_exp":
                    return ImplantEffect.DexterityExp
                case "agility_exp":
                    return ImplantEffect.AgilityExp
                case "charisma_exp":
                    return ImplantEffect.CharismaExp

                case "hacking":
                    return ImplantEffect.Hacking
                case "hacking_exp":
                    return ImplantEffect.HackingExp
                case "hacking_chance":
                    return ImplantEffect.HackingChance
                case "hacking_money":
                    return ImplantEffect.HackingMoney
                case "hacking_speed":
                    return ImplantEffect.Speed
                case "hacking_grow":
                    return ImplantEffect.Grow

                case "faction_rep":
                    return ImplantEffect.FactionRep
                case "company_rep":
                    return ImplantEffect.CompanyRep
                case "crime_money":
                    return ImplantEffect.CrimeMoney
                case "crime_success":
                    return ImplantEffect.CrimeChance
                case "work_money":
                    return ImplantEffect.WorkMoney
                case "hacknet_node_money":
                    return ImplantEffect.HacknetMoney
                default:
                    throw new Error(`Oops: ${raw}`)
            }
        })

    const result = new Set(effects)
    if (ALL_SKILLS.every((stat) => result.has(stat))) {
        ALL_SKILLS.forEach((stat) => result.delete(stat))
        result.add(ImplantEffect.All)
    } else if (COMBAT_SKILLS.every((stat) => result.has(stat))) {
        COMBAT_SKILLS.forEach((stat) => result.delete(stat))
        result.add(ImplantEffect.Combat)
    }

    if (ALL_EXP_SKILLS.every((stat) => result.has(stat))) {
        ALL_EXP_SKILLS.forEach((stat) => result.delete(stat))
        result.add(ImplantEffect.AllExp)
    } else if (COMBAT_EXP_SKILLS.every((stat) => result.has(stat))) {
        COMBAT_EXP_SKILLS.forEach((stat) => result.delete(stat))
        result.add(ImplantEffect.CombatExp)
    }

    return result
}

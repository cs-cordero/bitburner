import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    const original = "/Users/cs-cordero/Downloads/bitburnerSave_1701225258_BN1x2.json"
    const cheat = "/Users/cs-cordero/Downloads/cheated.json"
    const fs = require("fs")
    const rawb64 = fs.readFileSync(original, "utf8")
    const json = JSON.parse(atob(rawb64))
    const playerSave = JSON.parse(json.data.PlayerSave)
    playerSave.data.exploits = [
        "Bypass",
        "PrototypeTampering",
        "Unclickable",
        "UndocumentedFunctionCall",
        "TimeCompression",
        "RealityAlteration",
        "N00dles",
        "YoureNotMeantToAccessThis",
        "TrueRecursion",
        "INeedARainbow",
        "EditSaveFile",
    ]
    const playerSaveStringified = JSON.stringify(playerSave)
    json.data.PlayerSave = playerSaveStringified
    const rawJson = JSON.stringify(json)
    const b64 = btoa(rawJson)
    fs.writeFileSync(cheat, b64)
}

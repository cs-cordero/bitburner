import { NS } from "@ns";
import { formatNumber } from "/util";

/**
 * Many of my AI-XXX.js scripts run with --once. As a result, they aren't long-running and the ScriptExpGain scripts are not helpful.
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
    const cyclesBetweenOutput = 60;
    const snapshotSize = 30;
    const expSnapshots: number[] = []

    let currentCycle = 0;
    let prevExp = ns.getPlayer().exp.hacking;
    while (true) {
        const currExp = ns.getPlayer().exp.hacking;
        const expGain = currExp - prevExp;
        prevExp = currExp;

        expSnapshots.push(expGain)
        while (expSnapshots.length > snapshotSize) {
            expSnapshots.shift()
        }

        if (currentCycle >= cyclesBetweenOutput) {
            const avgExpGainPerSecond = expSnapshots.reduce((a, b) => a + b, 0) / snapshotSize
            ns.tprint(`Current exp gain rate: ${formatNumber(avgExpGainPerSecond, false)}/s`)
            currentCycle = 0;
        }

        await ns.sleep(1000)
        currentCycle += 1;
    }
}
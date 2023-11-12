import { NS } from "@ns";
import { waitUntilPidFinishes } from "/util";

export async function main(ns: NS): Promise<void> {
  await waitUntilPidFinishes(ns, ns.run("orchestrate-killall.js"));
  ns.killall()
}
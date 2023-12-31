import { NS } from "@ns"
import { getFlagOnlyArgs, getPwndServers } from "/lib/util"

/**
 * Syncs all the scripts on the home computer to all the pwnd servers.
 */
export async function main(ns: NS): Promise<void> {
    const args = getFlagOnlyArgs(ns)

    while (true) {
        for (const pwndServer of getPwndServers(ns)) {
            // send all files on home to the server.
            const homeFiles = ns.ls("home").filter((fileName) => fileName.endsWith(".js"))
            ns.scp(homeFiles, pwndServer)

            // remove files that don't exist on home
            ns.ls(pwndServer)
                .filter((fileName) => !homeFiles.includes(fileName))
                .filter((fileName) => fileName.endsWith(".js"))
                .forEach((fileName) => ns.rm(fileName, pwndServer))
        }

        if (args.once) {
            break
        }

        await ns.sleep(10000)
    }
}

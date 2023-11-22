import { NS } from "@ns"

/**
 * Algorithmic Stock Trader II
 */
export function algorithmicStockTraderII(ns: NS, input: any): string {
    const prices = input as number[]

    let totalProfit = 0
    let buyPrice = prices[0]
    let unrealizedGain = 0
    for (let i = 1; i < prices.length; i++) {
        const priceIncreasing = prices[i] >= prices[i - 1]
        if (priceIncreasing) {
            unrealizedGain = Math.max(unrealizedGain, prices[i] - buyPrice)
        } else {
            totalProfit += unrealizedGain
            unrealizedGain = 0
            buyPrice = prices[i]
        }
    }
    if (unrealizedGain > 0) {
        totalProfit += unrealizedGain
    }

    return totalProfit.toString()
}

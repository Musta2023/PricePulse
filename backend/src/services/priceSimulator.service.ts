import prisma from "../db/prisma";

/**
 * Pure function to calculate price variation (±5%)
 * Extracted for unit testing as per technical challenge requirements.
 */
export function calculateNewPrice(currentPrice: number): number {
    const variation = (Math.random() - 0.5) * 0.1; // ±5%
    let newPrice = currentPrice * (1 + variation);
    return Math.round(newPrice * 100) / 100;
}

async function updatePrice(){
    const  products = await prisma.product.findMany()
    for (const product of products){
        const newPrice = calculateNewPrice(product.currentPrice);
        await prisma.product.update({
            where:{id:product.id},
            data:{currentPrice:newPrice, lastUpdate: new Date()},
        })
    }
    console.log(`Price updated at ${new Date().toISOString()}`)
}

// Start the simulator only if not in test environment

setInterval(updatePrice, 30000);
updatePrice().catch(console.error);


export default updatePrice

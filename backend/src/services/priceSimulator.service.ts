import prisma from "../db/prisma";

async function updatePrice(){
    const  products = await prisma.product.findMany()
    for (const product of products){
        const variation = (Math.random()-0.5)*0.1
        let newPrice = product.currentPrice*(1+variation)
        newPrice=Math.round(newPrice*100)/100
        await prisma.product.update({
            where:{id:product.id},
            data:{currentPrice:newPrice, lastUpdate: new Date()},
            
            
        })
    }
    console.log(`Price updated at ${new Date().toISOString()}`)
}
setInterval(updatePrice,30000);
updatePrice().catch(console.error);
export default updatePrice

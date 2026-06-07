import 'dotenv/config';
import prisma from '../db/prisma';
async function seed(){
    const existing= await prisma.user.findFirst();
    if(!existing){
        await prisma.user.create({
            data:{
                email:'default@user.com',
                name: 'default user'
            }
        });
        console.log('default user created')
    }else {
        console.log ("user already created")
    }
}
seed().catch(console.error).finally(()=>prisma.$disconnect());

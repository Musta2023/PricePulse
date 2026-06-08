import 'dotenv/config';
import prisma from '../db/prisma';
import bcrypt from 'bcrypt';

async function seed(){
    const existing= await prisma.user.findFirst();
    if(!existing){
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.create({
            data:{
                email:'default@user.com',
                name: 'default user',
                password: hashedPassword
            }
        });
        console.log('default user created')
    }else {
        console.log ("user already created")
    }
}
seed().catch(console.error).finally(()=>prisma.$disconnect());

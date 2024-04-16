import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const allUsers = await prisma.users.findMany()
    console.log(allUsers,allUsers.length);
    
    allUsers.forEach(user => console.log(user.user_id));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
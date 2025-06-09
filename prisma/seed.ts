import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a stable
  const stable = await prisma.stable.create({
    data: {
      name: "Main Stable",
      capacity: 10,
      occupied: 0,
      lastCleaned: new Date(),
      nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "operational"
    }
  })

  // Create a horse
  const horse = await prisma.horse.create({
    data: {
      name: "Thunder",
      breed: "Arabian",
      age: 5,
      status: "healthy",
      imageUrl: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5",
      description: "A magnificent Arabian horse",
      stableId: stable.id
    }
  })

  // Create a staff member
  const staff = await prisma.staff.create({
    data: {
      name: "John Smith",
      role: "Trainer",
      experience: 5,
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      contact: "+1234567890"
    }
  })

  // Create some events
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Morning Training",
        type: "training",
        date: new Date(today.setHours(9, 0, 0, 0)),
        description: "Regular morning training session",
        horseId: horse.id,
        staffId: staff.id
      }
    }),
    prisma.event.create({
      data: {
        title: "Health Check",
        type: "health-check",
        date: new Date(tomorrow.setHours(14, 0, 0, 0)),
        description: "Regular health checkup",
        horseId: horse.id,
        staffId: staff.id
      }
    }),
    prisma.event.create({
      data: {
        title: "Stable Maintenance",
        type: "maintenance",
        date: new Date(nextWeek.setHours(10, 0, 0, 0)),
        description: "Weekly stable maintenance",
        horseId: horse.id,
        staffId: staff.id
      }
    })
  ])

  console.log({ stable, horse, staff, events })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

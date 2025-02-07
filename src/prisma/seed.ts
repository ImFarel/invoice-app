import { PrismaClient, type Prisma } from '@prisma/client'
import { addDays } from 'date-fns'

const prisma = new PrismaClient()

const invoices: Prisma.InvoiceCreateInput[] = [
  {
    name: 'Invoice 1',
    invoiceNumber: 'INV-0001',
    amount: 1000,
    dueDate: addDays(new Date(), 7),
    status: 2
  },
  {
    name: 'Invoice 2',
    invoiceNumber: 'INV-0002',
    amount: 1500,
    dueDate: addDays(new Date(), 7),
    status: 1
  },
  {
    name: 'Invoice 3',
    invoiceNumber: 'INV-0003',
    amount: 2000,
    dueDate: addDays(new Date(), 7),
    status: 2
  },
  {
    name: 'Invoice 4',
    invoiceNumber: 'INV-0004',
    amount: 2500,
    dueDate: addDays(new Date(), 7),
    status: 1
  },
  {
    name: 'Invoice 5',
    invoiceNumber: 'INV-0005',
    amount: 3000,
    dueDate: addDays(new Date(), 7),
    status: 2
  },
  {
    name: 'Invoice 6',
    invoiceNumber: 'INV-0006',
    amount: 3500,
    dueDate: addDays(new Date(), 7),
    status: 1
  },
  {
    name: 'Invoice 7',
    invoiceNumber: 'INV-0007',
    amount: 4000,
    dueDate: addDays(new Date(), 7),
    status: 2
  },
  {
    name: 'Invoice 8',
    invoiceNumber: 'INV-0008',
    amount: 4500,
    dueDate: addDays(new Date(), 7),
    status: 1
  },
  {
    name: 'Invoice 9',
    invoiceNumber: 'INV-0009',
    amount: 5000,
    dueDate: addDays(new Date(), 7),
    status: 2
  },
  {
    name: 'Invoice 10',
    invoiceNumber: 'INV-0010',
    amount: 5500,
    dueDate: addDays(new Date(), 7),
    status: 1
  }
]

async function main() {
  console.log('Seeding...')
  await prisma.invoice.createMany({
    data: invoices
  })
}

main()
  .then(() => {
    console.log('Seeding done')
  })
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit()
  })

import type { Prisma } from '@prisma/client'

export type TInvoiceFormValues = Prisma.InvoiceCreateInput & { _status?: { label: string; value: string } }

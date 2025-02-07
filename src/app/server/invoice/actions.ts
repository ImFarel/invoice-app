'use server'

import { cache } from 'react'

import { revalidatePath } from 'next/cache'

import type { Invoice, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type ServerActionResponse<T> = {
  status: boolean
  message: string
  stack?: any
  data: T | null
}

export const findInvoice = async (id: number): Promise<ServerActionResponse<Invoice>> => {
  try {
    const data = await prisma.invoice.findFirst({
      where: {
        id
      }
    })

    return { status: true, data, message: 'Invoice fetched successfully' }
  } catch (err) {
    console.error(err)

    return { status: false, message: 'Error from findInvoice in Server Action', stack: err as any, data: null }
  }
}

export const getInvoices = cache(async (): Promise<ServerActionResponse<Invoice[]>> => {
  try {
    const data = await prisma.invoice.findMany()

    return { status: true, data, message: 'Invoices fetched successfully' }
  } catch (err) {
    console.error(err)

    return {
      status: false,
      message: 'Error from getInvoices in Server Action',
      stack: err,
      data: null
    }
  }
})

export const createInvoice = async (data: Prisma.InvoiceCreateInput): Promise<ServerActionResponse<Invoice>> => {
  try {
    const invoice = await prisma.invoice.create({
      data
    })

    revalidatePath('/invoices')

    return {
      status: true,
      data: invoice,
      message: 'Invoice created successfully'
    }
  } catch (err) {
    console.error(err)

    return {
      status: false,
      message: 'Error createInvoice from Server Action',
      stack: err,
      data: null
    }
  }
}

export const updateInvoice = async (
  id: number,
  data: Prisma.InvoiceUpdateInput
): Promise<ServerActionResponse<Invoice>> => {
  try {
    const invoice = await prisma.invoice.update({
      where: {
        id
      },
      data
    })

    revalidatePath('/invoices')

    return {
      status: true,
      message: 'Invoice updated!',
      data: invoice
    }
  } catch (err) {
    console.error(err)

    return {
      status: false,
      message: 'Error updateInvoice from Server Action',
      stack: err,
      data: null
    }
  }
}

export const deleteInvoice = async (id: number): Promise<ServerActionResponse<Invoice>> => {
  try {
    const invoice = await prisma.invoice.delete({
      where: {
        id
      }
    })

    revalidatePath('/invoices')

    return {
      status: true,
      message: 'Invoice deleted!',
      data: invoice
    }
  } catch (err) {
    console.error(err)

    return {
      status: false,
      message: 'Error deleteInvoice from Server Action',
      stack: err,
      data: null
    }
  }
}

import { getInvoices } from '@/app/server/invoice/actions'
import InvoiceList from '@/views/invoice/list'

// every 25 seconds
export const revalidate = 25

export default async function InvoicesPage() {
  const { data, status, message } = await getInvoices()

  if (!status) {
    return <div>Error: {message}</div>
  }

  return <InvoiceList data={data ?? []} />
}

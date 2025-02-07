import { format } from 'date-fns'

import { findInvoice } from '@/app/server/invoice/actions'
import InvoiceForm from '@/views/invoice/form'
import type { TInvoiceFormValues } from '@/types/invoiceFormValues'

export default async function InvoicesFormPage({ params }: { params: { form: string } }) {
  const isEdit = params.form !== 'create'

  let defaultValues: TInvoiceFormValues = {
    name: '',
    invoiceNumber: '',
    amount: 0,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 0,
    _status: {
      label: 'Unpaid',
      value: '0'
    }
  }

  if (isEdit) {
    const { data, status, message } = await findInvoice(parseInt(params.form))

    if (!status || data === null) {
      return <div>Error: {message}</div>
    }

    defaultValues = data
    defaultValues.dueDate = format(data.dueDate, 'yyyy-MM-dd')
    defaultValues._status = {
      label: {
        0: 'Unpaid',
        1: 'Pending',
        2: 'Paid'
      }[data.status]!,
      value: data.status.toString()
    }
  }

  return <InvoiceForm isEdit={isEdit ? params.form : null} defaultValues={defaultValues} />
}

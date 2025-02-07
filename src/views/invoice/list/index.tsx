'use client'

import { useEffect, useState } from 'react'

import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import type { Invoice } from '@prisma/client'

import DebouncedInput from '@/components/input/DebounceTextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import OptionMenu from '@/@core/components/option-menu'
import ConfirmationDialogs from '@/components/dialogs/confirmation-dialog'
import { deleteInvoice } from '@/app/server/invoice/actions'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f7f9fc',
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

// PRIMARY COLOR #1e2433
// TABLE HEADER COLOR #f7f9fc
// BACKGROUND #f2f5f9

const statusOptions = [
  { label: 'All Status', value: -1 },
  { label: 'Unpaid', value: 0 },
  { label: 'Pending', value: 1 },
  { label: 'Paid', value: 2 }
]

export default function InvoiceList({ data }: { data: Invoice[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState({ label: 'All Status', value: -1 })
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filteredData, setFilteredData] = useState<Invoice[]>(data)

  const [alert, setAlert] = useState<{
    status: boolean
    message: string
  } | null>(null)

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedInvoice) {
      try {
        const action = await deleteInvoice(selectedInvoice.id)

        if (!action.status) {
          throw new Error(action.message)
        }

        setAlert({
          status: true,
          message: action.message
        })
        setTimeout(() => {
          setAlert(null)
        }, 3000)
      } catch (error) {
        setAlert({
          status: false,
          message: JSON.stringify(error)
        })
        console.error(error)
      } finally {
        setOpenDialog(false)
      }
    }
  }

  useEffect(() => {
    let filtered = data

    if (search) {
      filtered = filtered.filter(invoice => invoice.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (status.value !== -1) {
      filtered = filtered.filter(invoice => invoice.status === status.value)
    }

    setFilteredData(filtered)
  }, [data, search, status])

  return (
    <>
      <Grid container spacing={2} marginBlockEnd={6} alignItems='center'>
        <Grid item xs={8}>
          <Typography variant='h1'>Invoices</Typography>
        </Grid>

        <Grid item xs={2}>
          <DebouncedInput
            value={search ?? ''}
            onChange={value => setSearch(String(value))}
            placeholder='Search invoice by name'
            sx={{
              '& .MuiInput-input': {
                backgroundColor: 'red'
              }
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <CustomAutocomplete
            fullWidth
            disableClearable
            value={status}
            onChange={(e, value) => value && setStatus(value)}
            options={statusOptions}
            getOptionLabel={option => option.label}
            renderInput={params => <CustomTextField placeholder='All Status' {...params} />}
          />
        </Grid>
      </Grid>

      {alert && (
        <Alert severity={alert.status ? 'success' : 'error'} onClose={() => setAlert(null)} sx={{ mb: 2 }}>
          <AlertTitle>{alert.status ? 'Success' : 'Error'}</AlertTitle>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Typography variant='h6'>Name</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant='h6'>Due Date</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant='h6'>Status</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant='h6'>Amount</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant='h6'>Actions</Typography>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={5}>
                      <Typography variant='h6'>No invoices found</Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {filteredData.map(row => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component='th' scope='row'>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.dueDate.toLocaleDateString()}</StyledTableCell>
                    <StyledTableCell>
                      {
                        {
                          0: <Chip label='Unpaid' color='error' />,
                          1: <Chip label='Pending' color='warning' />,
                          2: <Chip label='Paid' color='success' />
                        }[row.status]
                      }
                    </StyledTableCell>
                    <StyledTableCell>{row.amount}</StyledTableCell>
                    <StyledTableCell>
                      <OptionMenu
                        icon='tabler-dots-vertical'
                        options={[
                          {
                            text: 'Edit',
                            href: `/invoices/${row.id}`
                          },
                          {
                            divider: true
                          },
                          {
                            text: 'Delete',
                            menuItemProps: {
                              onClick: () => handleDeleteClick(row)
                            }
                          }
                        ]}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ConfirmationDialogs
        open={openDialog}
        setOpen={setOpenDialog}
        onConfirm={handleConfirmDelete}
        title='Delete Invoice'
        description={`Are you sure you want to delete the invoice "${selectedInvoice?.name}"?`}
      />
    </>
  )
}

'use client'

import { useState } from 'react'

import Link from 'next/link'

import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  Typography
} from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'

import { format, isValid, parse } from 'date-fns'

import type { TInvoiceFormValues } from '@/types/invoiceFormValues'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/components/react-datepicker/AppReactDatepicker'
import { createInvoice, updateInvoice } from '@/app/server/invoice/actions'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

type InvoiceFormProps = {
  isEdit: string | null
  defaultValues: TInvoiceFormValues
}

const statusOptions = [
  { label: 'Unpaid', value: '0' },
  { label: 'Pending', value: '1' },
  { label: 'Paid', value: '2' }
]

const invoiceSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  invoiceNumber: z.string().min(1, { message: 'Invoice Number is required' }),
  amount: z
    .number()
    .or(z.string().transform(val => parseFloat(val)))
    .refine(val => !isNaN(val) && val > 0, { message: 'Amount must be a positive number' }),
  dueDate: z
    .string()
    .min(1, { message: 'Due Date is required' })
    .transform(val => parse(val, 'yyyy-MM-dd', new Date()))
    .refine(val => isValid(val), { message: 'Due Date must be a valid date in the format YYYY-MM-DD' }),
  status: z
    .number()
    .or(z.string().transform(val => parseInt(val)))
    .refine(val => !isNaN(val) && val <= 2, { message: 'Status should be either Unpaid, Pending, or Paid' })
})

export default function InvoiceForm({ isEdit, defaultValues }: InvoiceFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  const {
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    setError,
    control
  } = useForm({
    defaultValues,
    resolver: zodResolver(invoiceSchema)
  })

  const submitHandler = async (data: Omit<TInvoiceFormValues, 'createdAt' | 'updatedAt'>) => {
    try {
      let response
      const payload = { ...data, status: data?._status ? parseInt(data?._status?.value) : data.status }

      if (!isEdit) {
        response = await createInvoice(payload)
      } else {
        response = await updateInvoice(parseInt(isEdit), payload)
      }

      if (!response.status) {
        throw new Error(response.message)
      }

      setServerMessage(response?.message ?? 'An error occurred while submitting the form')
    } catch (error) {
      console.error(error)
      setError('root', { message: 'An error occurred while submitting the form' })
    }
  }

  return (
    <>
      <Grid container spacing={2} marginBlockEnd={6} alignItems='center'>
        <Grid item>
          <Typography variant='h3'>{isEdit ? `Editing "${defaultValues.name}"` : 'Create'} Invoice</Typography>
        </Grid>
      </Grid>

      <Card sx={{ mb: 4 }}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span>
                          Name <small style={{ color: 'red' }}>*</small>
                        </span>
                      }
                      InputLabelProps={{
                        className: 'font-bold'
                      }}
                      {...(errors.name && {
                        error: true,
                        helperText: errors.name.message
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='invoiceNumber'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span>
                          Invoice Number <small style={{ color: 'red' }}>*</small>
                        </span>
                      }
                      InputLabelProps={{
                        className: 'font-bold'
                      }}
                      {...(errors.invoiceNumber && {
                        error: true,
                        helperText: errors.invoiceNumber.message
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='amount'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span>
                          Amount <small>(IDR)</small> <small style={{ color: 'red' }}>*</small>
                        </span>
                      }
                      sx={{
                        '& .MuiInputBase-sizeSmall.MuiInputBase-adornedStart:not(.MuiAutocomplete-inputRoot)': {
                          paddingInlineStart: '0'
                        }
                      }}
                      InputLabelProps={{
                        className: 'font-bold'
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            disablePointerEvents
                            position='start'
                            sx={{
                              padding: '18.5px 14px',
                              backgroundColor: theme => theme.palette.divider,
                              borderTopLeftRadius: theme => theme.shape.borderRadius + 'px',
                              borderBottomLeftRadius: theme => theme.shape.borderRadius + 'px'
                            }}
                          >
                            Rp
                          </InputAdornment>
                        )
                      }}
                      {...(errors.amount && {
                        error: true,
                        helperText: errors.amount.message
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='dueDate'
                  control={control}
                  render={({ field }) => (
                    <>
                      <AppReactDatepicker
                        isClearable
                        showYearDropdown
                        showMonthDropdown
                        dateFormat={'yyyy-MM-dd'}
                        minDate={new Date()}
                        onChange={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        shouldCloseOnSelect={false}
                        disabled={isSubmitting}
                        selected={field.value ? new Date(field.value) : null}
                        customInput={
                          <CustomTextField
                            fullWidth
                            disabled={isSubmitting}
                            label={
                              <span>
                                Due Date <small style={{ color: 'red' }}>*</small>
                              </span>
                            }
                            InputLabelProps={{
                              className: 'font-bold'
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <i className='tabler-calendar' />
                                </InputAdornment>
                              )
                            }}
                            {...(errors.dueDate && { error: true })}
                          />
                        }
                      />
                      {errors.dueDate && <small style={{ color: 'red' }}>{errors.dueDate.message}</small>}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='_status'
                  control={control}
                  render={({ field }) => (
                    <CustomAutocomplete
                      {...field}
                      disableClearable
                      value={field.value}
                      options={statusOptions}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      getOptionLabel={option => option.label}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          label={
                            <span>
                              Status <small style={{ color: 'red' }}>*</small>
                            </span>
                          }
                          InputLabelProps={{
                            className: 'font-bold'
                          }}
                          {...(errors.status && {
                            error: true,
                            helperText: errors.status.message
                          })}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
              {isSubmitting && <CircularProgress size={20} color='inherit' />} {isEdit ? 'Update ' : 'Create '}
              Invoice
            </Button>
            <Button variant='contained' color='secondary' disabled={isSubmitting} href='/invoices' LinkComponent={Link}>
              Back
            </Button>
          </CardActions>
        </form>
      </Card>

      {isSubmitSuccessful && (
        <Alert severity='success'>
          <AlertTitle>Success</AlertTitle>
          {serverMessage || `Invoice ${isEdit ? 'updated' : 'created'} successfully`}
        </Alert>
      )}

      {errors.root && (
        <Alert severity='error'>
          <AlertTitle>Error</AlertTitle>
          {errors.root.message}
        </Alert>
      )}
    </>
  )
}

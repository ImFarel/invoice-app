// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface ConfirmationDialogsProps {
  open: boolean
  onConfirm?: () => void
  setOpen: (open: boolean) => void
  handleClose?: () => void
  description?: string
  title?: string
}

const ConfirmationDialogs: React.FC<ConfirmationDialogsProps> = ({
  open,
  onConfirm,
  handleClose,
  setOpen,
  description,
  title
}) => {
  const closeHandler = () => {
    if (handleClose) {
      handleClose()
    } else {
      setOpen(false)
    }
  }

  const confirmHandler = () => {
    if (onConfirm) onConfirm()
    closeHandler()
  }

  return (
    <Dialog open={open} onClose={closeHandler} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
      <DialogTitle id='dialog-title' className='text-base font-bold'>
        {title ? title : `Confirmation`}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id='dialog-description'>
          {description ? description : `Are you sure about what you do?`}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeHandler} color='secondary'>
          No
        </Button>
        <Button onClick={confirmHandler} color='primary' variant='contained'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialogs

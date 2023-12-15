// ** React Imports
import { useUser } from 'src/@core/context/userDataContext'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const TabProfile = () => {
  const userData = useUser()

  const userFirstName = userData?.user_metadata?.first_name
  const userLastName = userData?.user_metadata?.last_name
  const userEmail = userData?.email
  const createdAt = userData?.created_at

  if (!userData) {
    return (
      <div className='grid justify-center h-96 p-10'>
        <Typography variant='h4' sx={{ my: 4, color: 'primary.main' }} className='animate-spin'>
          &#128640;
        </Typography>
        <Typography variant='h6'>Loading data ...</Typography>
      </div>
    )
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7} sx={{ marginTop: 1, marginBottom: 10 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='First Name' defaultValue={userFirstName} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Last Name' defaultValue={userLastName} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type='email' label='Email Address' defaultValue={userEmail} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Account Status'
              defaultValue={`Active since ${new Date(createdAt).toLocaleDateString()}`}
              disabled
            />
          </Grid>
          {false ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }
              >
                <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  Resend Confirmation
                </Link>
              </Alert>
            </Grid>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          {/**<LoadingButton disabled variant='outlined' sx={{ marginRight: 3.5 }}>
            Update Changes
          </LoadingButton>
           <Button type='reset' variant='outlined' color='error'>
              Deactivate Store
            </Button> */}
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Alert severity='warning' sx={{ '& a': { fontWeight: 400 } }}>
              <AlertTitle>Kindly contact support to update your email.</AlertTitle>
            </Alert>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabProfile

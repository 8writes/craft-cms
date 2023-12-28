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
import Skeleton from '@mui/material/Skeleton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const TabProfile = () => {
  const userData = useUser()
  const [newEmail, setNewEmail] = useState(userData?.email)
  const [isEditing, setIsEditing] = useState(false)
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const isLoading = !userData

  const userFirstName = userData?.user_metadata?.first_name
  const userLastName = userData?.user_metadata?.last_name
  const subscription = userData?.user_metadata?.subscription
  const createdAt = userData?.created_at
 const oldEmail = userData?.email;
const changeEmail = userData?.email_change;

  const handleEmailChange = event => {
    setNewEmail(event.target.value)
  }

 const handleUpdateEmail = async () => {
  try {
    const { data, error } = await supabase.auth.updateUser({ email: `${newEmail}` })
    if (error) {
      setFailed(error.message)
    } else {
      setSuccess('Email updated successfully!')
      setNewEmail(changeEmail); // Update local state with the new email
    }
  } catch (error) {
    // Handle error if needed
  } finally {
    setIsEditing(false)
  }
  setTimeout(() => {
    setSuccess('')
  }, 2000)
 }
  
  return (
    <CardContent>
      {success && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='success' sx={{ '& a': { fontWeight: 500 } }}>
            <AlertTitle>{success}</AlertTitle>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='error' sx={{ '& a': { fontWeight: 500 } }}>
            <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
          </Alert>
        </Grid>
      )}
      {isLoading ? (
        <Grid container spacing={7} sx={{ marginTop: 1, marginBottom: 10 }}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Skeleton animation='wave' height={70} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <form>
          <Grid container spacing={7} sx={{ marginTop: 1, marginBottom: 10 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='First Name' defaultValue={userFirstName} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Last Name' defaultValue={userLastName} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEditing ? (
                <TextField fullWidth type='email' label='Email Address' value={newEmail} onChange={handleEmailChange} />
              ) : (
                <TextField fullWidth type='email' label='Email Address' defaultValue={oldEmail} disabled />
              )}
              {isEditing ? (
                <>
                  <LoadingButton
                    variant='outlined'
                    size='small'
                    sx={{ margin: '5px' }}
                    type='button'
                    onClick={handleUpdateEmail}
                  >
                    Confirm
                  </LoadingButton>
                  <LoadingButton
                    variant='outlined'
                    size='small'
                    sx={{ margin: '5px' }}
                    type='button'
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </LoadingButton>
                </>
              ) : (
                <LoadingButton type='button' sx={{ margin: '5px' }} size='small' onClick={() => setIsEditing(true)}>
                  Update Email
                </LoadingButton>
              )}
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
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' label='Subscription' defaultValue={subscription} disabled />
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
            {/*<LoadingButton disabled variant='outlined' sx={{ marginRight: 3.5 }}>
            Update Changes
          </LoadingButton>
           <Button type='reset' variant='outlined' color='error'>
              Deactivate Store
            </Button> *

            <Grid item xs={12} sx={{ mt: 5 }}>
              <Alert severity='warning' sx={{ '& a': { fontWeight: 400 } }}>
                <AlertTitle>Kindly contact support to update your email.</AlertTitle>
              </Alert>
              </Grid>
                */}
          </Grid>
        </form>
      )}
    </CardContent>
  )
}

export default TabProfile

// ** React Imports
import { useState } from 'react'
import { useUser } from 'src/@core/context/userDataContext'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const StoreSetting = () => {
  const userData = useUser()
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')

  // ** State

  const userEmail = userData?.email
  const storeName = userData?.user_metadata?.store_name
  const userId = userData?.id
  const userStatus = userData?.user_metadata?.storage

  
 const handleStorage = async () => {
    try {
      const { data, error } = await supabase.storage.createBucket(`${storeName}`, {
        public: true,
        user_id: userId,
        email: userEmail,
        fileSizeLimit: 1024 * 1024
      })

      if (error) {
        setFailed(error.message)
      } else {
        handleUserUpdate()
        setSuccess('Account activated Successfully!')
      }
    } catch (error) {
      console.error('Error handling storage:', error.message)
    } finally {
      
      setTimeout(() => {
        setSuccess('')
      }, 9000)
    }
 }
  

  const handleUserUpdate = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { storage: true }
      })
      if (error) {
       setFailed(error.message)
      }
    } catch (error) {
      console.error('Error handling user update:', error.message)
    }
  }

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
      <form>
        <Grid container spacing={7} sx={{ marginTop: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Store Name' defaultValue={storeName ? storeName.toUpperCase() : ''} disabled />
          </Grid>
          {userStatus ? (<Grid item xs={12} sx={{ mt: 5 }}>
              <Alert severity='success' sx={{ '& a': { fontWeight: 400 } }}>
                <AlertTitle>Your store is activated!</AlertTitle>
              </Alert>
            </Grid>): (
            
            <Grid item xs={12} sx={{ mt: 5 }}>
              <Alert severity='warning' sx={{ '& a': { fontWeight: 400 } }}>
                <AlertTitle>Kindly activate your store <span className='cursor-pointer underline' onClick={handleStorage}>Here</span></AlertTitle>
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </CardContent>
  )
}

export default StoreSetting

// ** React Imports
import { useState } from 'react'
import { useUser } from 'src/@core/context/userDataContext'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
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
  const [isLoading, setLoading] = useState(false)

  // const [userStatus, setUserStatus] = useState('')

  // ** State
  const storeName = userData?.user_metadata?.store_name
  const userId = userData?.id
  const userEmail = userData?.email
  const userStatus = userData?.user_metadata?.storage

  const handleStorage = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.createBucket(`${storeName}`, {
        public: true,
        user_id: userId,
        email: userEmail,
        fileSizeLimit: 1024 * 1024
      })

      if (error) {
        console.log(error)
      } else {
        handleUserUpdate()
      }
    } catch (error) {
      console.error('Error handling storage:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { storage: true }
      })
      if (error) {
        console.log(error)
      }

      //   console.log('data:', data)
      //  const userStatus = data?.user_metadata?.storage
      //   console.log('userdata:', userStatus)
      //   setUserStatus(userStatus)
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
      <form>
        <Grid container spacing={7} sx={{ marginTop: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Store Name' defaultValue={storeName ? storeName.toUpperCase() : ''} disabled />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              onClick={handleStorage}
              loading={Boolean(isLoading)}
              disabled={Boolean(userStatus)}
              variant='outlined'
              sx={{ marginRight: 3.5 }}
            >
              Initialize Store
            </LoadingButton>
            <Grid item xs={12} sx={{ mt: 5 }}>
              <Alert severity='warning' sx={{ '& a': { fontWeight: 400 } }}>
                <AlertTitle>Initialize your store and contact support to activate.</AlertTitle>
              </Alert>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default StoreSetting

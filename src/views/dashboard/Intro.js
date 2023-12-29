// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useUser } from 'src/@core/context/userDataContext'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { Alert, AlertTitle, Grid, Skeleton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  zIndex: -1,
  position: 'absolute'
})

const Intro = () => {
  const userData = useUser()
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')


  const userEmail = userData?.email
  const userFirstName = userData?.user_metadata?.first_name
  const storeName = userData?.user_metadata?.store_name
  const userId = userData?.id
  const userStatus = userData?.user_metadata?.storage

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

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
        setFailed(error.message)
      } else {
        handleUserUpdate()
        setSuccess('Storage initialized Successfully!')
      }
    } catch (error) {
      console.error('Error handling storage:', error.message)
    } finally {
      setLoading(false)
      
      setTimeout(() => {
        setSuccess('')
      }, 8000)
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

  return (
    <Card sx={{ position: 'relative' }}>
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
      <CardContent>
        {userData ? ( <><Typography variant='h5'>Welcome,  {userFirstName}</Typography></> ) : (<><Skeleton animation="wave" height={30} width={200}/></>)} 
        {userData ? (
          <>
            <Typography variant='h6'></Typography>
            <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
              {userEmail}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton animation="wave" height={30} width={250}/>
          </>
        )}
        {userData ? (<>
        {userStatus ? (
          <div className='mt-5 flex justify-end '>
            <Link href='/add-new-product' passHref >
              <Button size='medium' variant='outlined'>
                Add New Product
              </Button>
            </Link>
            
          </div>
        ) : (
          <>
            <Typography variant='h6' sx={{ my: 4, color: 'primary.main' }}>
              Kindly activate your account
            </Typography>
            
             <LoadingButton
              onClick={handleStorage}
              loading={Boolean(isLoading)}
              variant='contained'
              sx={{ marginRight: 3.5 }}
            >
              Activate account
            </LoadingButton>
           
          </>
        )}
        </>) : (<><Skeleton animation="wave" height={60} width={240} /></>)} 

        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default Intro

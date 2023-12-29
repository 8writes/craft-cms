// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useUser } from 'src/@core/context/userDataContext'
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid } from '@mui/material'
import Link from 'next/link'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { LoadingButton } from '@mui/lab'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const Trial = () => {
  const userData = useUser()
  const [isLoading, setLoading] = useState(false)

   const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isPopupTrialOpen, setIsPopupTrialOpen] = useState(false)

  const subscriptionValidity = userData?.user_metadata?.plan_validity
  const storeSubscription = userData?.user_metadata?.subscription
  const subscriptionAmount = userData?.user_metadata?.plan_amount
  const productCount = userData?.user_metadata?.product_count
  const trial = userData?.user_metadata?.trial

  const handleUpgradeSubscription = () => {
    // Open the popup
    setIsPopupOpen(true)
  }

  const closePopupAndUpgrade = () => {
    // Close the popup
    setIsPopupOpen(false)
    setIsPopupTrialOpen(false)
  }

  const handleFreeTrial = () => {
    // Open the popup
    setIsPopupTrialOpen(true)
  }

  useEffect(() => {
    const validateTrial = async () => {
      try {
        // Calculate the date one month from now
        const currentDate = new Date()
        const oneMonthLater = new Date(currentDate)
        oneMonthLater.setMonth(currentDate.getMonth() + 1)

        const { data, error } = await supabase.auth.user()

        if (error) {
          console.error(error)

          return
        }

        const planValidityDate = oneMonthLater.toISOString().substring(0, 10)

        // Check if the current date is equal to or exceeds the plan_validity date
        if (currentDate >= planValidityDate) {
          const { data, error } = await supabase.auth.updateUser({
            data: {
              plan_validity: 'Expired',
              product_count: '0'
            }
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

    validateTrial() // Call the function when the component mounts
  }, [])

  const handleFreeTrialUpload = async () => {
    try {
      setLoading(true)

      // Calculate the date one month from now
      const currentDate = new Date()
      const oneMonthLater = new Date(currentDate)
      oneMonthLater.setMonth(currentDate.getMonth() + 1)

      // Extract only the date part in the format "YYYY-MM-DD"
      const planValidityDate = oneMonthLater.toISOString().substring(0, 10)

      const { data, error } = await supabase.auth.updateUser({
        data: {
          subscription: 'Trial',
          trial: true,
          plan_validity: planValidityDate,
          product_count: '5'
        }
      })
      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Free trial successfully activated!')
      }
    } catch (error) {
    } finally {
      setLoading(false)

        setTimeout(() => {
        setSuccess('')
      }, 8000)
    }
  }

  // Loading skeleton
  if (!userData) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant='rectangular' width='100%' height={150} animation='wave' />
        </CardContent>
      </Card>
    )
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
        <Typography variant='h5' gutterBottom>
          Your Current Plan
        </Typography>
        <Typography variant='h6' gutterBottom>
          Subscription: {storeSubscription}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Amount: ₦{subscriptionAmount} (NGN)
        </Typography>
        <Typography variant='body1' gutterBottom>
          Expires: {subscriptionValidity}
        </Typography>
        <Divider />
        <Typography
          sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '25px' }}
          variant='body1'
          gutterBottom
        >
          Max Products: {productCount}
        </Typography>

        <Box className='mt-5 flex justify-end gap-2'>
          {!trial && (
            <Button
              variant='outlined'
              size='large'
              onClick={handleFreeTrial}
              className=' text-white font-bold py-2 px-4 rounded'
            >
              Free Trial
            </Button>
          )}
          {/* Open the Dialog on button click */}
          <LoadingButton
            variant='outlined'
            size='large'
            onClick={handleUpgradeSubscription}
            className=' text-white font-bold py-2 px-4 rounded'
          >
            Upgrade Plan
          </LoadingButton>
        </Box>

        {/* Dialog for displaying subscription details 111*/}
        <Dialog open={isPopupTrialOpen} onClose={() => setIsPopupTrialOpen(false)}>
          <DialogTitle className='flex justify-between items-center'>
            Subscription Details
            <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => setIsPopupTrialOpen(false)} />
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <Typography variant='body1' gutterBottom>
                Plan: Trial
              </Typography>
              <Typography variant='body1' gutterBottom>
                Amount: ₦0 (NGN)
              </Typography>
              <Typography variant='body1' gutterBottom>
                Valid for: 1 month
              </Typography>
              <Divider />
              <Typography variant='body1' gutterBottom>
                Max Products: 5
              </Typography>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ display: 'grid' }}>
            {/* Button to confirm and proceed with payment */}
            <LoadingButton
              variant='outlined'
              size='large'
              disabled={trial}
              loading={Boolean(isLoading)}
              onClick={handleFreeTrialUpload}
              className=' text-white font-bold py-2 px-4 rounded'
            >
              Upgrade Plan
            </LoadingButton>
          </DialogActions>
        </Dialog>
        {/* Dialog for displaying subscription details */}
        <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <DialogTitle className='flex justify-between items-center'>
            Subscription Details
            <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => setIsPopupOpen(false)} />
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <Typography variant='body1' gutterBottom>
                Plan: Basic
              </Typography>
              <Typography variant='body1' gutterBottom>
                Amount: ₦5000 (NGN)
              </Typography>
              <Typography variant='body1' gutterBottom>
                Valid for: 1 month
              </Typography>
              <Divider />
              <Typography variant='body1' gutterBottom>
                Max Products: 50
              </Typography>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ display: 'grid' }}>
            {/* Button to confirm and proceed with payment */}
            <LoadingButton
              variant='outlined'
              size='large'
              onClick={closePopupAndUpgrade}
              disabled
              className=' text-white font-bold py-2 px-4 rounded'
            >
              Upgrade Plan
            </LoadingButton>
            <Typography variant='body1' sx={{ margin: '5px' }} gutterBottom>
              Contact{' '}
              <Link href='#' passHref>
                <span className='underline cursor-pointer'>support</span>
              </Link>{' '}
              to upgrade
            </Typography>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default Trial

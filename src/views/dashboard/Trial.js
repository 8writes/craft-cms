// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useUser } from 'src/@core/context/userDataContext'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid
} from '@mui/material'
import Link from 'next/link'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Skeleton from '@mui/material/Skeleton'
import axios from 'axios'

const Trial = () => {
  const userData = useUser()
  const [isLoading, setLoading] = useState(false)

  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isPopupTrialOpen, setIsPopupTrialOpen] = useState(false)

  const id = userData?.id
  const store_name_id = userData?.store_name_id
  const plan_validity = userData?.plan_validity
  const subscription = userData?.subscription
  const plan_amount = userData?.plan_amount
  const product_count = userData?.product_count
  const trial = userData?.trial

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

  const handleFreeTrialUpdate = async () => {
    try {
      setLoading(true)

          // Retrieve the stored session data from localStorage
      const session = localStorage.getItem('auth-token');

      // Check if the session data is a valid JSON string
      if (!session) {
        throw new Error('Invalid session data in localStorage');
      }

      const sessionData = JSON.parse(session);

      const userSessionData = sessionData || null;

      // Calculate the date one month from now
      const currentDate = new Date();
      const oneMonthLater = new Date(currentDate);
      oneMonthLater.setMonth(currentDate.getMonth() + 1);

      // Extract only the date part in the format "YYYY-MM-DD"
      const planValidity = oneMonthLater.toISOString().substring(0, 10);

      const response = await axios.post(` https://craftserver.onrender.com/v1/api/updateuser?id=${userSessionData.id}`, {
        store_name_id,
        subscription: 'Trial',
        trial: true,
        plan_validity: planValidity,
        product_count: '26'
      });

      const { error } = response.data;

      if (error) {
        setFailed(error.message);
      } else {
        setSuccess('Free trial successfully activated!');
      }
    } catch (error) {

      console.log('An unexpected error ocurred:', error.message)
    } finally {
      setLoading(false)

      setIsPopupOpen(false)
      setIsPopupTrialOpen(false)

      // Trigger screen refresh
      window.location.reload(true)

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
            <span className='text-white'> {success}</span>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='error' sx={{ '& a': { fontWeight: 500 } }}>
            <span className='text-white'> {failed}</span>
            <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
          </Alert>
        </Grid>
      )}
      <CardContent>
        <Typography variant='h5' gutterBottom>
          Your Current Plan
        </Typography>
        <Typography variant='h6' gutterBottom>
          Subscription: {subscription}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Amount: ₦{plan_amount} (NGN)
        </Typography>
        <Typography variant='body1' gutterBottom>
          Expires: {plan_validity}
        </Typography>
        <Divider />
        <Typography
          sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '25px' }}
          variant='body1'
          gutterBottom
        >
          Max Products: {product_count}
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
                Max Products: 26
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
              onClick={handleFreeTrialUpdate}
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
                Amount: ₦5,000 (NGN)
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

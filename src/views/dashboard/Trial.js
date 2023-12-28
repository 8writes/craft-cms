// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useUser } from 'src/@core/context/userDataContext'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl } from '@mui/material'
import Link from 'next/link'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'


const Trial = () => {
   const userData = useUser()

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const subscriptionValidity = userData?.user_metadata?.validity
  const storeSubscription = userData?.user_metadata?.subscription
  const subscriptionAmount = userData?.user_metadata?.sub_amount
  const maxProducts = userData?.user_metadata?.max_product

  const handleUpgradeSubscription = () => {
    // Open the popup before triggering the Paystack payment
    setIsPopupOpen(true)
  }

  const closePopupAndUpgrade = () => {
    // Close the popup
    setIsPopupOpen(false)

  }


  return (
    <Card sx={{ position: 'relative'}}>
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
          Valid for: {subscriptionValidity}
        </Typography>
        <Divider />
        <Typography sx={{display: 'flex', justifyContent: 'flex-end', marginRight: '25px'}} variant='body1' gutterBottom>
          Max Products: {maxProducts}
        </Typography>

        <Box className='mt-5 flex justify-end'>
          {/* Open the Dialog on button click */}
          <Button
            variant='outlined'
            size='large'
            onClick={handleUpgradeSubscription}
            className='paystack-button text-white font-bold py-2 px-4 rounded'
          >
            Upgrade Plan
          </Button>
        </Box>
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
          <DialogActions sx={{display: 'grid'}}>
            {/* Button to confirm and proceed with payment */}
            <Button
              variant='outlined'
              size='large'
              onClick={closePopupAndUpgrade}
              disabled
              className='paystack-button text-white font-bold py-2 px-4 rounded'
            >
              Upgrade Plan
            </Button>
            <Typography variant='body1' sx={{margin: '5px'}} gutterBottom>
              Contact <Link href='#' passHref><span className='underline cursor-pointer'>support</span></Link> to upgrade
            </Typography>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default Trial

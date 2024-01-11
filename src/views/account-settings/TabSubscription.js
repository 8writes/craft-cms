import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { usePaystackPayment } from 'react-paystack'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { useUser } from 'src/@core/context/userDataContext'
import Link from 'next/link'

const TabSubscription = () => {
  const userData = useUser()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const subscriptionValidity = userData?.plan_validity
  const storeSubscription = userData?.subscription
  const subscriptionAmount = userData?.plan_amount
  const  productCount = userData?.product_count

  // Paystack configuration
  const paystackPublicKey = 'pk_test_990b84e62bcd13690d07272f933a2080b195ce10' // Replace with your Paystack public key
  const amount = 5000 * 100 // Amount in kobo (5000 * 100)
  const currency = 'NGN' // Currency code

  // Paystack success and close handlers
  const paystackSuccess = reference => {
    console.log('Payment successful. Reference: ', reference)

    // Implement logic to update user subscription in your backend
  }

  const paystackClose = () => {
    console.log('Payment closed')
  }

  // Paystack payment initialization
  const initializePayment = usePaystackPayment({
    reference: `subscription_${new Date().getTime()}`,
    email: 'user@example.com', // Replace with the user's email
    amount,
    publicKey: paystackPublicKey,
    currency,
    onSuccess: paystackSuccess,
    onClose: paystackClose
  })

  const handleUpgradeSubscription = () => {
    // Open the popup before triggering the Paystack payment
    setIsPopupOpen(true)
  }

  const closePopupAndUpgrade = () => {
    // Close the popup
    setIsPopupOpen(false)

    // Trigger Paystack payment
    initializePayment()
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Subscription Plan: {storeSubscription}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Amount: ₦{subscriptionAmount} (NGN)
        </Typography>
        <Typography variant='body1' gutterBottom>
           Expires: {subscriptionValidity}
        </Typography>
        <Divider />
        <Typography variant='body1' gutterBottom>
          Max Products: { productCount}
        </Typography>

        <Box className='mt-5'>
          {/* Open the Dialog on button click */}
          <Button
            variant='outlined'
            size='large'
            onClick={handleUpgradeSubscription}
            className='paystack-button text-white font-bold py-2 px-4 rounded'
          >
            Upgrade Subscription
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

export default TabSubscription

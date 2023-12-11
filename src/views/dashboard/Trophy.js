// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useUser } from 'src/@core/context/userDataContext'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

const Trophy = () => {
  const userData = useUser()

  const userEmail = userData?.email
  const userFirstName = userData?.user_metadata?.first_name

  //  const userLastName = userData?.user_metadata?.last_name

  const userStatus = userData?.user_metadata?.storage

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5'>Welcome to your dashboard</Typography>
        {userData ? (
          <>
            <Typography variant='h6'>{userFirstName}🤠</Typography>
            <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
              {userEmail}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant='h6' sx={{ letterSpacing: '0.25px' }}>
              Loading...&#127744;
            </Typography>
          </>
        )}
        {userStatus ? (
          <>
             <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
              Your store is Activated
            </Typography>
            <Link href='/add-new-product' passHref>
              <Button size='medium' variant='outlined'>
                Add New Product
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
              Ready to activate your store?
            </Typography>
            <Link href='/account-settings' passHref>
              <Button size='medium' variant='contained'>
                Store Setting
              </Button>
            </Link>
          </>
        )}

        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default Trophy

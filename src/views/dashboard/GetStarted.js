// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { useUser } from 'src/@core/context/userDataContext'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

const GetStarted = () => {
  const userData = useUser()

  const userFirstName = userData?.user_metadata?.first_name
  const userStatus = userData?.user_metadata?.storage

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative'}}>
      <CardContent>
        {userStatus ? (
          <>
           <Typography variant='h4' sx={{ my: 4, color: 'primary.main' }}>
          Hi, {userFirstName}
        </Typography>
        <Typography variant='h6'>
          You will subsequently receive updates here.
        </Typography>
        <br />
         <Typography variant='h7' className='text-yellow-500'>
           Please also note that this product is still in development. Feedbacks & suggestions are always welcomed.
        </Typography>
          </>
        ) : (
          <>
           <Typography variant='h4' sx={{ my: 4, color: 'primary.main' }}>
          Hi, {userFirstName}
        </Typography>
              <Typography variant='h6'>
         There are several steps needed to setup your account but first,
          kindly initialize your store and then contact support to activate.
        </Typography>
        <br />
         <Typography variant='h7' className='text-yellow-500'>
           Please also note that this product is still in development. Feedbacks & suggestions are always welcomed.
        </Typography>
          </>
        )}
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default GetStarted

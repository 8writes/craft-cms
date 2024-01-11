// ** Imports
import { styled, useTheme } from '@mui/material/styles'
import { useUser } from 'src/@core/context/userDataContext'
import { Skeleton } from '@mui/material'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'

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

  const userEmail = userData?.email
  const userFirstName = userData?.first_name

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        {userData ? (
          <>
            <Typography variant='h5'>Welcome, {userFirstName}</Typography>
          </>
        ) : (
          <>
            <Skeleton animation='wave' height={30} width={200} />
          </>
        )}
        {userData ? (
          <>
            <Typography variant='h6'></Typography>
            <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
              {userEmail}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton animation='wave' height={30} width={250} />
          </>
        )}
        {userData ? (
          <>
            <div className='mt-5 flex justify-end '>
              <Link href='/add-new-product' passHref>
                <Button size='medium' variant='outlined'>
                  Add New Product
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Skeleton animation='wave' height={60} width={240} />
          </>
        )}

        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default Intro

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

const Stats = () => {
  const userData = useUser()

  const userFirstName = userData?.user_metadata?.first_name
  const userStatus = userData?.user_metadata?.storage

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative'}}>
      <CardContent>
       
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
      </CardContent>
    </Card>
  )
}

export default Stats

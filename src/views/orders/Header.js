// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

const IntroHeading = () => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card>
      <CardContent
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Typography variant='h5'>Orders</Typography>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
       {/**<Link href='/add-new-product' passHref>
          <Button size='medium' variant='contained'>
            <AddRoundedIcon /> Add product
          </Button>
        </Link> */}
      </CardContent>
    </Card>
  )
}

export default IntroHeading

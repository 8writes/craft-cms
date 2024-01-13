import { useUser } from 'src/@core/context/userDataContext'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import TourOutlinedIcon from '@mui/icons-material/TourOutlined'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

const salesData = [
  {
    stats: '0',
    title: 'Orders',
    color: '',
    icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '0',
    title: 'Customers',
    color: '',
    icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '0',
    color: '',
    title: 'Products sold',
    icon: <Inventory2OutlinedIcon sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '0',
    color: '',
    title: 'Website Visits',
    icon: <TourOutlinedIcon sx={{ fontSize: '1.75rem' }} />
  }
]

const renderStats = () => {
  return salesData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const Stats = () => {
  const userData = useUser()

  return (
    <Card>
      <CardHeader
        
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total of <span className='text-xl text-green-400'> 0</span> confirmed deliveries
            </Box>{' '}
            🤯
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <div className='flex flex-wrap gap-10 '>
          <div className='flex-1 flex text-center gap-2'>
            <TrendingUp sx={{ width: '25px', height: '50px' }} />
            <span className='flex-col justify-center w-full'>
              <Typography variant='body2'>
              Orders
              <br />
              <span className='text-xl'> 0 </span>{' '}
            </Typography>
            </span>
          </div>
          <div className='flex-1 flex text-center gap-2'>
            <EmojiPeopleOutlinedIcon sx={{ width: '25px', height: '50px' }} />
            <span className='flex-col justify-center w-full'>
              <Typography variant='body2'>
              Customers
              <br />
              <span className='text-xl'> 0 </span>{' '}
            </Typography>
            </span>
          </div>
          <div className='flex-1 flex text-center gap-2'>
            <Inventory2OutlinedIcon sx={{ width: '25px', height: '50px' }} />
            <span className='flex-col justify-center w-full'>
              <Typography variant='body2'>
              Products sold
              <br />
              <span className='text-xl'> 0 </span>{' '}
            </Typography>
            </span>
          </div>
          <div className='flex-1 flex text-center gap-2'>
            <TourOutlinedIcon sx={{ width: '25px', height: '50px' }} />
            <span className='flex-col justify-center w-full'>
              <Typography variant='body2'>
              Website Visits
              <br />
              <span className='text-xl'> 0 </span>{' '}
            </Typography>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Stats

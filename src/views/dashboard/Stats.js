import React, { useEffect, useState } from 'react';
import { useUser } from 'src/@core/context/userDataContext';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Skeleton } from '@mui/material';

const Stats = () => {
  const userData = useUser();
  const [dataCount, setDataCount] = useState(0);
   const [orderCount, setOrderCount] = useState(0);

  const store_name_id = userData?.store_name_id;
  const store_order_id = userData?.store_order_id

  console.log(store_name_id)

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://craftserver.onrender.com/v1/api/fetch?store_name_id=${store_name_id}`);
      const { error, data } = response.data;

      if (error) {
        console.error('Error fetching data:', error.message);

      } else {
        const productCount = data ? data.length : 0;
        setDataCount(productCount);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

   const fetchOrder = async () => {
    try {
      const response = await axios.get(` https://craftserver.onrender.com/v1/api/fetch?store_order_id=${store_order_id}`);
      const { error, data } = response.data;

      if (error) {
        console.error('Error fetching data:', error.message);

      } else {
        const productCount = data ? data.length : 0;
        setOrderCount(productCount);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    if (!dataCount) {
      fetchData();
      fetchOrder()
    }
  }, [store_name_id]);

  // Loading skeleton
  if (!userData) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant='rectangular' width='100%' height={150} animation='wave' />
        </CardContent>
      </Card>
    );
  }

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
              <span className='text-xl'> {orderCount} </span>{' '}
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
             Total Products
              <br />
              <span className='text-xl'> {dataCount} </span>{' '}
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

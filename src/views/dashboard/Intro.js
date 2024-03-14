// ** Imports
import { styled, useTheme } from '@mui/material/styles'
import { useUser } from 'src/@core/context/userDataContext'
import { Skeleton } from '@mui/material'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';

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
  const [isCopied, setIsCopied] = useState(false);

  const userEmail = userData?.email
  const userFirstName = userData?.first_name
  const storeUrl = userData?.store_url

  const handleCopyLink = () => {
    const textField = document.createElement('textarea');
    textField.innerText = `https://${storeUrl}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);

    // Set the copied state to true
    setIsCopied(true);

    // Reset the copied state after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

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
            <Typography variant='body2'>
              <a href={`https://${storeUrl}`} target='_blank' rel='noreferrer'>
                {storeUrl}<ArrowOutwardRoundedIcon sx={{ width: '18px', }}/>
              </a>
               <ContentCopyOutlinedIcon
        sx={{ width: '20px', cursor: 'pointer', mx:'4px', color: isCopied ? 'green' : 'inherit' }}
        onClick={handleCopyLink}
      />
              {isCopied && <span style={{ marginLeft: '5px', color: 'green' }}>Copied!</span>}
              
            </Typography>
            
          </>
        ) : (
          <>
            <Skeleton animation='wave' height={30} width={250} />
          </>
        )}
        {userData ? (
          <div className='flex justify-between'>
             
            <div className='mt-5 flex justify-end '>
              <Link href='/add-new-product' passHref>
                <Button size='medium' variant='outlined'>
                  <AddRoundedIcon />  Add Product
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Skeleton animation='wave' height={60} width={240} />
          </>
        )}

      </CardContent>
    </Card>
  )
}

export default Intro

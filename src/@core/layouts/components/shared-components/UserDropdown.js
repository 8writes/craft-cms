// ** React Imports
import { useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { useUser } from 'src/@core/context/userDataContext'
import axios from 'axios'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CogOutline from 'mdi-material-ui/CogOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  // ** States
  const userData = useUser()
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

const handleLogout = async () => {
  try {

    const response = await axios.post('https://craftserver.onrender.com/v1/api/signout');

    const { error } = response.data;

    if (error) {
      throw new Error('Error logging out');
    } else if (response.status === 200) {
      
      // Remove session from local storage
      localStorage.removeItem('auth-token');

      // Redirect to the login page
    await router.push('/login');
    }
  } catch (error) {
    console.error('Error during logout:', error.message);
  } finally { 
    // Trigger screen refresh
     window.location.reload(true)
  }
};


  const userFirstName = userData?.first_name
  const userLastName =  userData?.last_name

  const firstLetterOfLastName = userLastName ? userLastName.slice(0, 1) : ''

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>
                {userFirstName} .{firstLetterOfLastName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/profile')}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/account-settings')}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <Divider />

        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <span>
            <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
            Logout
          </span>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown

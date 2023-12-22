// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'

// ** Demo Tabs Imports
import StoreSetting from 'src/views/account-settings/TabStoreSetting'
import TabSecurity from 'src/views/account-settings/TabSecurity'
import TabAccountSetting from 'src/views/account-settings/TabAccountSetting'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState('store')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='store'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StorefrontRoundedIcon />
                <TabName>Store Setting</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Security</TabName>
              </Box>
            }
          /> <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ManageAccountsRoundedIcon  />
                <TabName>My Account</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='store'>
          <StoreSetting />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <TabSecurity />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='account'>
          <TabAccountSetting />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default AccountSettings

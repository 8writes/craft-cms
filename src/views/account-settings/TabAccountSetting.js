// ** React Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

const TabAccountSetting = () => {
  

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Alert severity='error' sx={{ '& a': { fontWeight: 400 } }}>
               Account deactivation may take upto 24hrs.<br /> Your account cannot be recovered after deactivation.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            {/** <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Update Changes
            </Button>*/}
            <Button variant='outlined' color='error'>
              Delete My Account
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccountSetting

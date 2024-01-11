// ** React Imports
import { useUser } from 'src/@core/context/userDataContext'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton';

const StoreSetting = () => {
  const userData = useUser()
  const isLoading = !userData

  const storeName = userData?.store_name_id
  const storeOrders = userData?.store_order_id

  return (
    <CardContent>
      {isLoading ? (
        <Grid container spacing={7} sx={{ marginTop: 1, marginBottom: 10 }}>
          <Grid item xs={12} sm={6}>
              <Skeleton animation="wave" height={70} />
            </Grid>
        </Grid>
      ) : (
        <form>
          <Grid container spacing={7} sx={{ marginTop: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Store Name Id' defaultValue={storeName ? storeName : ''} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Store Order Id' defaultValue={storeOrders ? storeOrders : ''} disabled />
              </Grid>
          </Grid>
        </form>
      )}
    </CardContent>
  )
}

export default StoreSetting

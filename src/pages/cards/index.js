// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardUser from 'src/views/all-products/cards/CardUser'
import CardImgTop from 'src/views/all-products/cards/CardImgTop'
import CardMobile from 'src/views/all-products/cards/CardMobile'
import CardSupport from 'src/views/all-products/cards/CardSupport'
import CardTwitter from 'src/views/all-products/cards/CardTwitter'
import CardFacebook from 'src/views/all-products/cards/CardFacebook'
import CardLinkedIn from 'src/views/all-products/cards/CardLinkedIn'
import CardAppleWatch from 'src/views/all-products/cards/CardAppleWatch'
import CardMembership from 'src/views/all-products/cards/CardMembership'
import CardInfluencer from 'src/views/all-products/cards/CardInfluencer'
import CardNavigation from 'src/views/all-products/cards/CardNavigation'
import CardWithCollapse from 'src/views/all-products/cards/CardWithCollapse'
import CardVerticalRatings from 'src/views/all-products/cards/CardVerticalRatings'
import CardNavigationCenter from 'src/views/all-products/cards/CardNavigationCenter'
import CardHorizontalRatings from 'src/views/all-products/cards/CardHorizontalRatings'

const CardBasic = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Basic Cards</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardImgTop />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardUser />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardWithCollapse />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardMobile />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardHorizontalRatings />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardAppleWatch />
      </Grid>
      <Grid item xs={12} md={8}>
        <CardMembership />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardInfluencer />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardVerticalRatings />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardSupport />
      </Grid>
      <Grid item xs={12} sx={{ pb: 4, pt: theme => `${theme.spacing(17.5)} !important` }}>
        <Typography variant='h5'>Navigation Cards</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <CardNavigation />
      </Grid>
      <Grid item xs={12} md={6}>
        <CardNavigationCenter />
      </Grid>
      <Grid item xs={12} sx={{ pb: 4, pt: theme => `${theme.spacing(17.5)} !important` }}>
        <Typography variant='h5'>Solid Cards</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardTwitter />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardFacebook />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardLinkedIn />
      </Grid>
    </Grid>
  )
}

export default CardBasic

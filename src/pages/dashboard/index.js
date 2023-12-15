
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
// import Table from 'src/views/all-products/Table'
import Trophy from 'src/views/dashboard/Trophy'

// import GetStarted from 'src/views/dashboard/GetStarted'

const Dashboard = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Trophy />
        </Grid>
       {/**  <Grid item xs={12} md={7} >
          <GetStarted />
        </Grid>*/}
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

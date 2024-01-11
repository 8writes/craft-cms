
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
// import Table from 'src/views/all-products/Table'
import Intro from 'src/views/dashboard/Intro'
import Stats from 'src/views/dashboard/Stats'
 import Trial from 'src/views/dashboard/Trial'

const Dashboard = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Intro />
        </Grid>
        <Grid item xs={12} md={7} >
          <Stats />
        </Grid>
        <Grid item xs={12} md={5} >
          <Trial />
        </Grid>
        
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

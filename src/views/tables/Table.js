// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Demo Components Imports
import IntroHeading from '../all-products/IntroHeading'

const rows = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    price: '₦6,000',
    id: '#3648',
    tag: 'Human Resources Assistant'
  },
  {
    age: 61,
    date: '09/23/2016',
    price: '₦5,000',
    status: 'professional',
    name: 'Margaret Bowers',
    id: '#3648',
    tag: 'Nuclear Power Engineer'
  },
  {
    age: 59,
    date: '10/15/2017',
    name: 'Minnie Roy',
    status: 'rejected',
    price: '₦14,000',
    id: '#3648',
    tag: 'Environmental Specialist'
  },
  {
    age: 30,
    date: '06/12/2018',
    status: 'resigned',
    price: '₦20,000',
    name: 'Ralph Leonard',
    id: '#3839  ',
    tag: 'Sales Representative'
  },
  {
    age: 66,
    status: 'applied',
    date: '03/24/2018',
    price: '₦9,000',
    name: 'Annie Martin',
    tag: 'Operator',
    id: '#3648'
  },
]

const DashboardTable = () => {
  return (
    <Card>
      <Grid item xs={12} md={4}>
          <IntroHeading />
        </Grid>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Date Uploaded</TableCell>
              <TableCell>Price</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `₦{theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                    <Typography variant='caption'>{row.tag}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable

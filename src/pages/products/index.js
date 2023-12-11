// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TableStickyHeader from 'src/views/all-products/TableStickyHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Products = () => {
  // ** State

  return (
    <Card>
      <Grid item xs={12}>
        <TableStickyHeader />
      </Grid>
    </Card>
  )
}

export default Products

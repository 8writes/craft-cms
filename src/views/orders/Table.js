import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Alert, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useUser } from 'src/@core/context/userDataContext'

const columns = [
  { id: 'sn', label: 'S/N' },
  { id: 'full_name', label: 'Name' },
  { id: 'reference', label: 'Reference ID' },
  { id: 'order_date', label: 'Date' },
  { id: 'price', label: 'Amount(₦)', format: value => value.toLocaleString('en-US') },
  { id: 'email', label: 'Email Address' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: '' }
]

const TableStickyHeader = () => {
  const userData = useUser()
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [suspense, setSuspense] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [normalData, setNormalData] = useState([])
  const [searchData, setSearchData] = useState([])

  // States for edit functionality
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [editOrderStatus, setEditOrderStatus] = useState(0)

  const [editOrderId, setEditOrderId] = useState(null)
  const [deleteOrderId, setDeleteOrderId] = useState(null)
  const [detailsDialogId, setDetailsDialogId] = useState(null)

  // States for popover
  const [anchorEl, setAnchorEl] = useState(null)

  // Function to handle the opening of the popover
  const handlePopoverOpen = (event, id) => {
    setAnchorEl(event.currentTarget)
    setDeleteOrderId(id)
  }

  // Function to handle the closing of the popover
  const handlePopoverClose = () => {
    setAnchorEl(null)
    setDeleteOrderId(null)
  }

  const user_id = userData?.user_id
  const store_order_id = userData?.store_order_id

  useEffect(() => {
    if (store_order_id) {
      fetchData()
    }
   }, [store_order_id])
  
  const fetchData = async () => {
    setSuspense(true)
    try {
       const response = await axios.get(` https://craftserver.onrender.com/v1/api/fetch?store_order_id=${store_order_id}`)

      const { error, data } = response.data

      if (error) {
        setFailed(error.message)
      }

      // Reset the id counter
      let idCounter = 0

      const formattedData = data.map(item => ({
        ...item,
        sn: ++idCounter
      }))

      setNormalData(formattedData)

      const filteredData = formattedData.filter(item => item.reference.toLowerCase().includes(searchTerm.toLowerCase()))

      setSearchData(filteredData)
    } catch (error) {
      console.error(error)
      setFailed(error.message)
    } finally {
      setSuspense(false)
    }
  }

  const handleSearch = id => {
    fetchData(id) // Trigger fetch data with the search term
  }

  const handleDelete = async id => {
    setDeleteLoadingId(id)
 
    try {
     const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/delete?store_order_id=${store_order_id}&id=${id}&user_id=${user_id}`
      )

      const { error } = response.data

      if (error) {
        setFailed(error.message)
      } else {
        setFailed('')
        setSuccess('Order deleted successfully!')
      }
      setDeleteOrderId(null)
      setEditOrderId(null)
      setAnchorEl(null)
    } catch (error) {
      setFailed('Network error')
    } finally {
      setDeleteLoadingId(null)
      fetchData()

      // Reset success and failure after a delay
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    }
  }

  // Function to handle opening the details dialog
  const handleDetails = row => {
    setDetailsDialogId(row)
  }

  const handleEdit = id => {
    setEditOrderId(id)
  }

  // Handle saving edited Order
  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/update?store_order_id=${store_order_id}`,
        { editOrderStatus, editOrderId }
      )

      const { error } = response.data

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Order updated successfully!')
      }

      await fetchData()
      setDeleteOrderId(null)
      setEditOrderId(null)
      setAnchorEl(null)
    } catch (error) {
      console.error('Error updating data:', error.message)
    } finally {
      setIsLoading(false)

      // Reset success and failure after a delay
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // Determine which data to use based on whether a search is active
  const dataToUse = searchTerm.length > 0 ? searchData : normalData

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {success && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='success' sx={{ '& a': { fontWeight: 500 } }}>
            <span className='text-white'> {success}</span>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='error' sx={{ '& a': { fontWeight: 500 } }}>
            <span className='text-white'> {failed}</span>
            <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
          </Alert>
        </Grid>
      )}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1px'
            }}
          >
            <Typography variant='h5'>Orders</Typography>
            {/* Step 3: Add search bar with SearchIcon */}
            <TextField
              label='Reference ID'
              variant='outlined'
              value={searchTerm}
              autoComplete='off'
              className=' md:w-3/6 w-4/6'
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon onClick={handleSearch} sx={{ cursor: 'pointer' }} />
              }}
            />
            <RefreshIcon className='cursor-pointer md:mr-10' onClick={fetchData} />
          </CardContent>
        </Card>
      </Grid>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          {suspense ? (
            <TableBody>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    <Skeleton animation='wave' />
                  </TableCell>
                ))}
                <TableCell>
                  <Skeleton animation='wave' />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableBody>
                {dataToUse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'size' && Array.isArray(row[column.id])
                          ? row[column.id].map((size, index) => (
                              <span key={index}>
                                {size}
                                {index < row[column.id].length - 1 && ', '}
                              </span>
                            ))
                          : column.format && typeof row[column.id] === 'number'
                          ? column.format(row[column.id])
                          : row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <MoreVertIcon
                        onClick={event => handlePopoverOpen(event, row.id)}
                        aria-controls={Boolean(anchorEl) ? 'edit-delete-popover' : undefined}
                        aria-haspopup='true'
                        sx={{ cursor: 'pointer' }}
                      />
                      <Popover
                        id='edit-delete-popover'
                        open={Boolean(anchorEl && deleteOrderId === row.id)}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                      >
                        <MenuItem onClick={() => handleDetails(row)}>Details</MenuItem>
                        <MenuItem onClick={() => handleEdit(row.id)}>Update</MenuItem>
                        <MenuItem onClick={() => handleDelete(row.id)} disabled={Boolean(deleteLoadingId === row.id)}>
                          Delete
                        </MenuItem>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>

        {dataToUse.length === 0 && !suspense && (
          <div className='text-center my-10'>
            <Typography variant='h4' className='text-slate-100'>
              No orders yet.
            </Typography>
          </div>
        )}
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editOrderId)} onClose={() => setEditOrderId(null)}>
        <DialogTitle className='flex justify-between items-center'>
          Update Order <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => setEditOrderId(null)} />
        </DialogTitle>
        <DialogContent className='grid gap-5'>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Order Status</InputLabel>
              <Select
                label='Order Status'
                type='text'
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
                value={editOrderStatus}
                onChange={e => setEditOrderStatus(e.target.value)}
              >
                <MenuItem value='Shipped'>Shipped</MenuItem>
                <MenuItem value='Delivered'>Delivered</MenuItem>
                <MenuItem value='Refunded'>Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={Boolean(isLoading)} variant='outlined' onClick={handleSaveEdit}>
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {/* Details Dialog */}
      <Dialog open={detailsDialogId} onClose={() => setDetailsDialogId(false)}>
        <DialogTitle className='flex justify-between items-center'>
          Order Details <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => setDetailsDialogId(false)} />
        </DialogTitle>
        <DialogContent className='grid gap-5'>
          {/* Render additional details from the selectedRow */}
          {detailsDialogId && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body1'>{`Name: ${detailsDialogId?.full_name || ''}`}</Typography>
                <Typography variant='body1'>{`${detailsDialogId?.order_date || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Email Address: ${detailsDialogId?.email || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Reference ID: ${detailsDialogId?.reference || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Phone Number: ${detailsDialogId?.phone_number || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Cart: ${detailsDialogId?.order_info || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Address: ${detailsDialogId?.address || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Note: ${detailsDialogId?.note || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Total Amount: ${
                  detailsDialogId?.price?.toLocaleString('en-US') || ''
                }`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>{`Status: ${detailsDialogId?.status || ''}`}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={dataToUse.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default TableStickyHeader

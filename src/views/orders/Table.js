import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Alert, AlertTitle, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'

import { useUser } from 'src/@core/context/userDataContext'
import IntroHeading from './Header'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

let idCounter = 0

const columns = [
  { id: 'sn', label: 'S/N' },
  { id: 'fullName', label: 'Name' },
  { id: 'reference', label: 'Reference ID' },
  { id: 'orderDate', label: 'Date' },
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

  // States for edit functionality
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableData, setTableData] = useState([])
  const [userId, setUserId] = useState('')
  const [editOrderId, setEditOrderId] = useState(0)
  const [editOrderStatus, setEditOrderStatus] = useState('')

  // States for popover
  // States for popover
  const [anchorEl, setAnchorEl] = useState(null)

  // Function to handle the opening of the popover
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  // Function to handle the closing of the popover
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const userId = data?.user?.id || ''
        setUserId(userId)
      } catch (e) {
        console.error('Error getting user:', e)
      }
    }

    if (userData?.user_metadata?.store_name) {
      getUser()
      fetchData()
    }
  }, [userData?.user_metadata?.store_name])

  const storeName = userData?.user_metadata?.store_name

  const fetchData = async () => {
    setSuspense(true)
    try {
      const { data, error } = await supabase.from('royeshoesOrders').select()

      if (error) {
        throw error
      }

      idCounter = 0

      const formattedData = data.map(item => ({
        ...item,
        sn: ++idCounter,
        image: item.uploadedImageUrl
      }))

      setTableData(formattedData)
    } catch (error) {
      console.error(error)
      setFailed(error)
    } finally {
      setSuspense(false)
    }
  }

  const handleDelete = async id => {
    setDeleteLoadingId(id)

    try {
      const { error } = await supabase.from('royeshoesOrders').delete().eq('user_id', userId).eq('id', id)

      if (error) {
        setFailed(error.message)
      } else {
        setFailed('')
        setSuccess('Order deleted successfully!')
      }
    } catch (error) {
      console.error(error)
      setFailed('Network error')
    } finally {
      setDeleteLoadingId(null)
      fetchData()

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    }
  }

  const handleEdit = (id, status) => {
    setEditOrderId(id)
  }

  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('royeshoesOrders')
        .update({ status: editOrderStatus })
        .eq('user_id', userId)
        .eq('id', editOrderId)

      if (error) {
        setFailed(error.message)
      } else {
        setFailed('')
        setSuccess('Order updated successfully!')
      }

      await fetchData()
      setEditOrderId(null)
      setAnchorEl(null)
    } catch (error) {
      console.error(error)
      setFailed(error)
    } finally {
      setIsLoading(false)

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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {success && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='success' sx={{ '& a': { fontWeight: 500 } }}>
            <AlertTitle>{success}</AlertTitle>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='error' sx={{ '& a': { fontWeight: 500 } }}>
            <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
          </Alert>
        </Grid>
      )}
      <Grid item xs={12} md={4}>
        <IntroHeading />
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
                {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
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
                        onClick={handlePopoverOpen}
                        aria-controls={Boolean(anchorEl) ? 'edit-delete-popover' : undefined}
                        aria-haspopup='true'
                        sx={{ cursor: 'pointer' }}
                      />
                      <Popover
                        id='edit-delete-popover'
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                      >
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

        {tableData.length === 0 && !suspense && (
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

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default TableStickyHeader

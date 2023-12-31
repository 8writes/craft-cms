// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
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
import TextField from '@mui/material/TextField'
import MoreVertIcon from '@mui/icons-material/MoreVert' // <-- Import MoreVertIcon
import Popover from '@mui/material/Popover'

import { useUser } from 'src/@core/context/userDataContext'
import IntroHeading from './Header'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

let idCounter = 0

// Define table columns
const columns = [
  { id: 'sn', label: 'S/N' },
  { id: 'image', label: 'Preview' },
  { id: 'name', label: 'Product Name' },
  { id: 'size', label: 'Size' },
  { id: 'date', label: 'Date' },
  { id: 'price', label: 'Price (₦)', format: value => value.toLocaleString('en-US') },
  { id: 'stock', label: 'Inventory' },
  { id: 'action', label: '' }
]

const TableStickyHeader = () => {
  const userData = useUser()
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [suspense, setSuspense] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableData, setTableData] = useState([])
  const [userId, setUserId] = useState('')
  const [editProductId, setEditProductId] = useState(null)
  const [editPrice, setEditPrice] = useState(0)
  const [editStock, setEditStock] = useState(0)
  const [imageUrls, setImageUrl] = useState([])

  // States for popover
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteProductId, setDeleteProductId] = useState(null)

  // Function to handle the opening of the popover
  const handlePopoverOpen = (event, id) => {
    setAnchorEl(event.currentTarget)
    setDeleteProductId(id)
  }

  // Function to handle the closing of the popover
  const handlePopoverClose = () => {
    setAnchorEl(null)
    setDeleteProductId(null)
  }

  // Fetch user data on component mount
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

    getUser()
    const storeName = userData?.user_metadata?.store_name

    if (storeName) {
      fetchData()
    }
  }, [userData?.user_metadata?.store_name])

  // Store user metadata and product data
  const storeName = userData?.user_metadata?.store_name

  // Fetch product data from Supabase
const fetchData = async () => {
  setSuspense(true);

  try {
    const { data, error } = await supabase.from(`${storeName}`).select();

    if (error) {
      throw error;
    }

    // Reset the id counter
    let idCounter = 0;

    // Update the id field with sequential count and add image URL
    const formattedData = data.map(item => ({
      ...item,
      sn: ++idCounter,
      image: item.uploadedImageUrls // Assuming uploadedImageUrls is an array of image URLs
    }));

    setImageUrl(formattedData.map(item => item.image));
    setTableData(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  } finally {
    setSuspense(false);
  }
};

  const handleDelete = async id => {
  setDeleteLoadingId(id);

  try {
    const productToDelete = tableData.find(product => product.id === id);
    await deleteImage(productToDelete.image); // Pass the image URLs to deleteImage function

    const { error } = await supabase.from(`${storeName}`).delete().eq('user_id', userId).eq('id', id);

    if (error) {
      setFailed(error.message);
    } else {
      setFailed('');
      setSuccess('Product deleted successfully!');
    }
    setDeleteProductId(null);
    setEditProductId(null);
    setAnchorEl(null);
  } catch (error) {
    setFailed('Network error');
  } finally {
    setDeleteLoadingId(null);
    fetchData();

    // Reset success and failure after a delay
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  }
  };
  
const deleteImage = async imageUrls => {
  try {
    // Modify the URLs to remove the dynamic part before the first "/"
    const modifiedUrls = imageUrls.map(url => {
      const firstSlashIndex = url.indexOf('/');
      
      return firstSlashIndex !== -1 ? url.slice(firstSlashIndex + 1) : url;
    });

    // Call the remove method with the array of objects
    const { data, error } = await supabase.storage.from(storeName).remove(modifiedUrls);

    if (error) {
      console.log('send error to support:', error.message);
    }
  } catch (error) {
    console.error('Error deleting images:', error.message);
  }
};

  // Handle product edit
  const handleEdit = (id, price, stock) => {
    setEditProductId(id)
    setEditPrice(price)
    setEditStock(stock)
  }

  // Handle saving edited product
  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from(`${storeName}`)
        .update({ price: editPrice, stock: editStock })
        .eq('user_id', userId)
        .eq('id', editProductId)

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Product updated successfully!')
      }

      await fetchData()
      setDeleteProductId(null)
      setEditProductId(null)
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

  // Handle page change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change in pagination
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

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
                        {column.id === 'image' ? (
                          <img
                            src={`https://hymcbwrcksuwhtfstztz.supabase.co/storage/v1/object/public/${row.image[0]}`}
                            alt={`Product ${row.sn} Image`}
                            style={{ width: '60px', height: '50px', borderRadius: '5px' }}
                          />
                        ) : column.id === 'size' ? (
                          row[column.id].map((size, index) => (
                            <span key={index}>
                              {size}
                              {index < row[column.id].length - 1 && ', '}
                            </span>
                          ))
                        ) : column.format && typeof row[column.id] === 'number' ? (
                          column.format(row[column.id])
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <MoreVertIcon
                        onClick={e => handlePopoverOpen(e, row.id)}
                        aria-controls={Boolean(anchorEl) ? 'edit-delete-popover' : undefined}
                        aria-haspopup='true'
                        sx={{ cursor: 'pointer' }}
                      />
                      <Popover
                        id='edit-delete-popover'
                        open={Boolean(anchorEl && deleteProductId === row.id)}
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
                        <MenuItem onClick={() => handleEdit(row.id, row.price, row.stock)}>Edit</MenuItem>
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
              No products yet.
            </Typography>
          </div>
        )}
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editProductId)} onClose={() => setEditProductId(null)}>
        <DialogTitle className='flex justify-between items-center'>
          Update Product <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => setEditProductId(null)} />
        </DialogTitle>
        <DialogContent className='grid gap-5'>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                label='Price(₦)'
                type='number'
                value={editPrice}
                onChange={e => setEditPrice(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Product Inventory</InputLabel>
              <Select
                label='Product Inventory'
                type='text'
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
                value={editStock}
                onChange={e => setEditStock(e.target.value)}
              >
                <MenuItem value='In Stock'>In Stock</MenuItem>
                <MenuItem value='Out of Stock'>Out of Stock</MenuItem>
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

      {/* Pagination */}
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

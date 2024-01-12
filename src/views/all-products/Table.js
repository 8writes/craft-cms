// ** React Imports
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RefreshIcon from '@mui/icons-material/Refresh'
import Link from 'next/link'
import { useUser } from 'src/@core/context/userDataContext'
import axios from 'axios'

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
  const [editProductId, setEditProductId] = useState(null)
  const [editPrice, setEditPrice] = useState(0)
  const [editStock, setEditStock] = useState(0)
  const [editName, setEditName] = useState(0)
  const [editSize, setEditSize] = useState([])
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

  // Store user metadata and product data
  const user_id = userData?.id
  const store_name_id = userData?.store_name_id
  const store_bucket_id = userData?.store_bucket_id

  // Fetch product

  useEffect(() => {
    if (store_name_id) {
      fetchData()
    }
  }, [store_name_id])

  const fetchData = async () => {
    setSuspense(true)

    try {
      const response = await axios.get(` https://craftserver.onrender.com/v1/api/fetch?store_name_id=${store_name_id}`)

      const { error, data } = response.data

      if (error) {
        setFailed(error.message)
      }

      // Reset the id counter
      let idCounter = 0

      // Update the id field with sequential count and add image URL
      const formattedData = data.map(item => ({
        ...item,
        sn: ++idCounter,
        image: item.uploaded_image_urls // Assuming uploaded_image_urls is an array of image URLs
      }))

      setImageUrl(formattedData.map(item => item.image))
      setTableData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error.message)
    } finally {
      setSuspense(false)
    }
  }

  const handleDelete = async id => {
    setDeleteLoadingId(id)

    try {
      const productToDelete = tableData.find(product => product.id === id)
      await deleteImage(productToDelete.image) // Pass the image URLs to deleteImage function

      const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/delete?store_name_id=${store_name_id}&id=${id}&user_id=${user_id}`
      )

      const { error } = response.data

      if (error) {
        setFailed(error.message)
      } else {
        setFailed('')
        setSuccess('Product deleted successfully!')
      }
      setDeleteProductId(null)
      setEditProductId(null)
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

  const deleteImage = async imageUrls => {
    try {
      const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/remove?store_bucket_id=${store_bucket_id}&modified_urls=${imageUrls}`
      )

      const { error } = response.data

      if (error) {
        setFailed(error.message)
      }
    } catch (error) {
      console.error('Error deleting images:', error.message)
    }
  }

  // Handle product edit
  const handleEdit = (id, price, stock, name) => {
    setEditProductId(id)
    setEditPrice(price)
    setEditStock(stock)
    setEditName(name)
  }

  // Handle saving edited product
  const handleSaveEdit = async () => {
    setIsLoading(true)

    try {
      const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/update?store_name_id=${store_name_id}&user_id=${user_id}`,
        {
          editPrice,
          editStock,
          editSize,
          editName,
          editProductId
        }
      )

      const { error } = response.data

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
            <Typography variant='h5'>Products</Typography>
            <div className='flex gap-2 items-center'>
              <Link href='/add-new-product' passHref>
                <Button size='medium' variant='text'>
                  <AddRoundedIcon /> Add product
                </Button>
              </Link>
              <RefreshIcon className='cursor-pointer' onClick={fetchData} />
            </div>
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
                  <>
                    <TableCell key={column.id}>
                      <Skeleton animation='wave' />
                    </TableCell>
                  </>
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
                        {column.id === 'image' && row.image ? (
                          <img
                            src={`${row.image[0]}`}
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
                        <MenuItem onClick={() => handleEdit(row.id, row.price, row.stock, row.name)}>Edit</MenuItem>
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
                label='Product Name'
                type='text'
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </FormControl>
          </Grid>
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
              <TextField
                label='New Sizes'
                type='text'
                placeholder='e.g., 40,XL,45'
                value={editSize}
                onChange={e => setEditSize(e.target.value.split(',').map(item => item.trim()))}
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

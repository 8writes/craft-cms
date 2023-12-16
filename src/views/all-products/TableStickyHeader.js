// ** React Imports
import { useState, useEffect, Suspense } from 'react'

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
import { useUser } from 'src/@core/context/userDataContext'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Demo Components Imports
import IntroHeading from './IntroHeading'
import { Alert, AlertTitle, Typography } from '@mui/material'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

let idCounter = 0

const columns = [
  { id: 'sn', label: 'S/N' },
  { id: 'image', label: 'Preview' },
  { id: 'name', label: 'Product Name' },
  { id: 'size', label: 'Size'},
  {
    id: 'date',
    label: 'Date'
  },
  {
    id: 'price',
    label: 'Price (₦)',
    format: value => value.toLocaleString('en-US')
  },
  { id: 'stock', label: 'Inventory' },
  { id: 'action', label: '' }
]

const TableStickyHeader = () => {
  const userData = useUser()
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [suspense, setSuspense] = useState('')

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableData, setTableData] = useState([])
  const [userId, setUserId] = useState('')

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

  const storeName = userData?.user_metadata?.store_name

  const fetchData = async () => {
    setSuspense('Loading products data...')
    try {
      const { data, error } = await supabase.from(`${storeName}`).select()

      if (error) {
        throw error
      }

      // Reset the id counter
      idCounter = 0

      // Update the id field with sequential count and add image URL
      const formattedData = data.map(item => ({
        ...item,
        sn: ++idCounter,
        image: item.uploadedImageUrl1
      }))

      setTableData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error.message)
    } finally {
      setSuspense('')
    }
  }

  const deleteImage = async id => {
    try {
      // Get all image URLs from the data based on the id
      const imageUrls = [
        tableData.find(item => item.id === id)?.uploadedImageUrl1,
        tableData.find(item => item.id === id)?.uploadedImageUrl2,
        tableData.find(item => item.id === id)?.uploadedImageUrl3
      ].filter(Boolean)

      // Remove the first segment from each image URL
      const modifiedUrls = imageUrls.map(url => {
        const segments = url.split('/')
        segments.shift() // Remove the first segment

        return segments.join('/')
      })

      // Remove images from Supabase storage using prefixes
      const { data, error } = await supabase.storage.from(`${storeName}`).remove(modifiedUrls)

      if (error) {
        console.log('send error to support:', error.message)
      }
    } catch (error) {
      console.error('Error deleting images:', error.message)
    }
  }

  const handleDelete = async id => {
    await deleteImage(id)

    try {
      const { error } = await supabase.from(`${storeName}`).delete().eq('user_id', userId).eq('id', id)

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Product deleted successfully!')
      }

      await fetchData()
    } catch (error) {
      console.error('Error deleting data:', error.message)
    } finally {
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
            <AlertTitle>
              {failed}
              <span className=' cursor-pointer px-2' onClick={() => setFailed('')}>
                &#128473;
              </span>
            </AlertTitle>
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
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.id === 'image' ? (
                      <img
                        src={`https://hymcbwrcksuwhtfstztz.supabase.co/storage/v1/object/public/${row[column.id]}`}
                        alt={`Product ${row.sn} Image`}
                        style={{ width: '60px', height: '50px', borderRadius: '5px' }}
                      />
                    ) : column.id === 'size' ? (
                        
                      // Map and join the size values with ","
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
                  <LoadingButton size='small' variant='outlined' onClick={() => handleDelete(row.id)}>
                    Delete
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {suspense ? (
          <div className='text-center my-10'>
            <Typography variant='h5' className='text-slate-100'>
              {suspense}
            </Typography>
          </div>
        ) : (
          <>
            {tableData.length === 0 && (
              <div className='text-center my-10'>
                <Typography variant='h4' className='text-slate-100'>
                  No products yet.
                </Typography>
              </div>
            )}
          </>
        )}
      </TableContainer>
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
  );
};

export default TableStickyHeader;
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { useUser } from 'src/@core/context/userDataContext'
import Link from 'next/link'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const FormLayoutsSeparator = () => {
  const userData = useUser()
  const router = useRouter()

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [productSize, setProductSize] = useState('')
  const [productTag, setProductTag] = useState('')
  const [productStock, setProductStock] = useState('')
  const [imageUrl1, setImageUrl1] = useState('')
  const [imageUrl2, setImageUrl2] = useState('')
  const [imageUrl3, setImageUrl3] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [userId, setUserId] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)

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
  })

  const emailAddress = userData?.email
  const storeName = userData?.user_metadata?.store_name

  const isDisabled =
    !productName ||
    !productDescription ||
    !productSize ||
    !productTag ||
    !productStock ||
    !sellingPrice ||
    !imageUrl1 ||
    !imageUrl2 ||
    !imageUrl3

  const uploadImage1 = async () => {
    try {
      const file = imageUrl1

      const { data, error } = await supabase.storage.from(`${storeName}`).upload(`${userId}/public/${uuidv4()}`, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Image 1 uploaded successfully!')
      }

      const url1 = data.fullPath

      return url1
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      return null // Return null or handle error as needed
    }
  }

  const uploadImage2 = async () => {
    try {
      const file = imageUrl2

      const { data, error } = await supabase.storage.from(`${storeName}`).upload(`${userId}/public/${uuidv4()}`, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Image 2 uploaded successfully!')
      }

      const url2 = data.fullPath

      return url2
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      return null // Return null or handle error as needed
    }
  }

  const uploadImage3 = async () => {
    try {
      const file = imageUrl3

      const { data, error } = await supabase.storage.from(`${storeName}`).upload(`${userId}/public/${uuidv4()}`, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Image 3 uploaded successfully!')
      }

      const url3 = data.fullPath

      return url3
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      return null // Return null or handle error as needed
    }
  }

  // Function to handle form data insertion
  const handleUploadForm = async (url1, url2, url3) => {
    try {
      const currentDate = new Date()
      const date = currentDate.toISOString().split('T')[0]

      // Prepare an array to store individual data objects
      const formDataArray = [
        {
          user_id: userId,
          created_at: new Date().toISOString(),
          name: productName,
          description: productDescription,
          price: sellingPrice,
          size: productSize,
          tag: productTag,
          email: emailAddress,
          stock: productStock,
          date: date,
          uploadedImageUrl1: url1,
          uploadedImageUrl2: url2,
          uploadedImageUrl3: url3
        }
      ]

      // Perform data insertion into Supabase
      const { data, error } = await supabase.from(`${storeName}`).insert(formDataArray)

      // Handle success or error
      if (error) {
        setFailed(error.message)
      } else {
        setSuccess('Product Uploaded successfully!')
      }
    } catch (error) {
      console.error('Unexpected error during upload:', error.message)
    } finally {
    }
  }

  // Function to handle the overall upload process
  const handleUpload = async () => {
    setLoading(true)
    setFormDisabled(true)

    try {
      const url1 = await uploadImage1()
      const url2 = await uploadImage2()
      const url3 = await uploadImage3()

      await handleUploadForm(url1, url2, url3)
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      // Return null or handle error as needed
      return null
    } finally {
      // Reset success and failure after a delay
      setTimeout(() => {
        setSuccess('')
      }, 9000)

       clearForm()

      setFormDisabled(false)
      setLoading(false)
    }
  }

  // Function to clear form fields
  const clearForm = () => {
    setProductName('')
    setProductDescription('')
    setProductSize('')
    setProductTag('')
    setSellingPrice('')
    setProductStock('')
    setImageUrl1('')
    setImageUrl2('')
    setImageUrl3('')
  }

  if (!userData) {
    return (
      <div className='grid justify-center h-96 p-10'>
        <Typography variant='h4' sx={{ my: 4, color: 'primary.main' }} className='animate-spin'>
          &#128640;
        </Typography>
        <Typography variant='h6'>Loading data ...</Typography>
      </div>
    )
  }

  return (
    <Card>
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
      <div className='flex items-center m-4 flex-wrap'>
        <CardHeader title='Add New Product' titleTypographyProps={{ variant: 'h6' }} />
        <Link href='/products' passHref>
          <Button size='medium' variant='outlined'>
            <KeyboardBackspaceIcon className='mr-2' />
            View all Products
          </Button>
        </Link>
      </div>
      <Divider sx={{ margin: 0 }} />
      <form method='POST' autoComplete='off' onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Upload Media
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <Box>
                  <ButtonStyled component='label' variant='text'>
                    {imageUrl1 ? <div className='text-green-400'>Uploaded</div> : <>Image 1</>}
                    <AddPhotoAlternateOutlinedIcon sx={{ width: '100px', height: '50px' }} />
                    <input
                      hidden
                      disabled={imageUrl1}
                      type='file'
                      onChange={e => {
                        const file = e.target.files[0]
                        setImageUrl1(file)
                      }}
                      id='image1'
                    />
                    {imageUrl1 ? (
                      <>
                        <Button
                          size='small'
                          color='error'
                          disabled={formDisabled}
                          onClick={() => {
                            setImageUrl1('')
                          }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
                  </ButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Supported formats: JPEG, PNG.
                  </Typography>
                </Box>
                <Box>
                  <ButtonStyled component='label' variant='text'>
                    {imageUrl2 ? <div className='text-green-400'>Uploaded</div> : <>Image 2</>}
                    <AddPhotoAlternateOutlinedIcon sx={{ width: '100px', height: '50px' }} />
                    <input
                      hidden
                      disabled={imageUrl2}
                      type='file'
                      onChange={e => {
                        const file = e.target.files[0]
                        setImageUrl2(file)
                      }}
                      id='image2'
                    />
                    {imageUrl2 ? (
                      <>
                        <Button
                          size='small'
                          color='error'
                          disabled={formDisabled}
                          onClick={() => {
                            setImageUrl2('')
                          }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
                  </ButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Supported formats: JPEG, PNG.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  <Box>
                    <ButtonStyled component='label' variant='text'>
                      {imageUrl3 ? <div className='text-green-400'>Uploaded</div> : <>Image 3</>}
                      <AddPhotoAlternateOutlinedIcon sx={{ width: '100px', height: '50px' }} />
                      <input
                        hidden
                        disabled={imageUrl3}
                        type='file'
                        onChange={e => {
                          const file = e.target.files[0]
                          setImageUrl3(file)
                        }}
                        id='image3'
                      />
                      {imageUrl3 ? (
                        <>
                          <Button
                            size='small'
                            color='error'
                            disabled={formDisabled}
                            onClick={() => {
                              setImageUrl3('')
                            }}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}
                    </ButtonStyled>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Supported formats: JPEG, PNG.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Product Info
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Product Name'
                placeholder='Input Product Name'
                id='productName'
                name='productName'
                type='text'
                disabled={formDisabled}
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Product Description'
                placeholder='Input Product Description'
                id='productDescription'
                name='productDescription'
                type='text'
                disabled={formDisabled}
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Selling Price'
                placeholder='Input Product Size'
                id='sellingPrice'
                name='sellingPrice'
                type='number'
                disabled={formDisabled}
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Product Size'
                placeholder='Input Product Size'
                id='productSize'
                name='productSize'
                type='number'
                disabled={formDisabled}
                value={productSize}
                onChange={e => setProductSize(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Product Tag</InputLabel>
                <Select
                  label='Product Tag'
                  defaultValue=''
                  name='productTag'
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  disabled={formDisabled}
                  value={productTag}
                  onChange={e => setProductTag(e.target.value)}
                >
                  <MenuItem value='men'>Mens Shoe</MenuItem>
                  <MenuItem value='women'>Women Shoe</MenuItem>
                  <MenuItem value='maleKid'>Male Kids Shoe</MenuItem>
                  <MenuItem value='femaleKid'>Female Kids Shoe</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Inventory</InputLabel>
                <Select
                  label='Product Inventory'
                  defaultValue=''
                  type='text'
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  name='productStock'
                  disabled={formDisabled}
                  value={productStock}
                  onChange={e => setProductStock(e.target.value)}
                >
                  <MenuItem value='In Stock'>In Stock</MenuItem>
                  <MenuItem value='Out of Stock'>Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <LoadingButton
            disabled={isDisabled}
            loading={isLoading}
            size='large'
            type='submit'
            sx={{ mr: 2 }}
            variant='outlined'
            onClick={handleUpload}
          >
            Upload New Product
          </LoadingButton>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator

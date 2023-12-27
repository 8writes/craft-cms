import { useEffect, useRef, useState } from 'react'
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
import { styled, useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { useUser } from 'src/@core/context/userDataContext'
import Link from 'next/link'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'

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

  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [productTag, setProductTag] = useState('')
  const [productStock, setProductStock] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [userId, setUserId] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [productSizes, setProductSizes] = useState([])
  const [selectedImages, setSelectedImages] = useState([])

  const MAX_IMAGES = 4 // Maximum number of images allowed

  const isMounted = useRef(true)

  const isDisabled =
    !productName || !productDescription || !productStock || !sellingPrice || !productTag || selectedImages.length === 0 

  // Function to handle size change
  const handleSizeChange = (index, value) => { 
    const newSizes = [...productSizes]
    newSizes[index] = value
    setProductSizes(newSizes)
  }

  // Function to handle removing a size
  const handleRemoveSize = index => {
    const newSizes = [...productSizes]
    newSizes.splice(index, 1)
    setProductSizes(newSizes)
  }

  // Function to handle adding a new size
  const handleAddSize = () => {
    // Check if the number of sizes is less than 8 before adding a new size
    if (productSizes.length < 8) {
      setProductSizes([...productSizes, '']) // Add an empty size
    } else {
      // You can show a message or take any other action if the limit is reached
      setFailed('maximum number of sizes exceeded')
    }
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
    getUser()
  })

  const emailAddress = userData?.email
  const storeName = userData?.user_metadata?.store_name

  const uploadImage = async index => {
    try {
      const file = selectedImages[index]

      if (!file === selectedImages[index]) {
        return null
      }

      const { data, error } = await supabase.storage.from(`${storeName}`).upload(`${userId}/public/${uuidv4()}`, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error) {
        setFailed(error.message)
      }

      const url = data.fullPath

      return url
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      return null
    }
  }

  // Function to handle form data insertion
  const handleUploadForm = async () => {
    try {
      const currentDate = new Date()
      const date = currentDate.toISOString().split('T')[0]

      // Filter out empty sizes
      const sizes = productSizes.filter(size => size.trim() !== '')

      const ImgUrls = await Promise.all(selectedImages.map((_, index) => uploadImage(index)))

      // Prepare an array to store individual data objects
      const formDataArray = [
        {
          user_id: userId,
          created_at: new Date().toISOString(),
          name: productName,
          description: productDescription,
          price: sellingPrice,
          size: sizes,
          tag: productTag,
          email: emailAddress,
          stock: productStock,
          date: date,
          uploadedImageUrls: ImgUrls
        }
      ]

      // Perform data insertion into Supabase
      const { data, error } = await supabase.from(`${storeName}`).insert(formDataArray)

      // Handle success or error
      if (error) {
        setFailed(error.message)
      } else {
        setFailed('')
        setSuccess('Product Uploaded successfully!')
      }
    } catch (error) {
      setFailed(error.message)
    } finally {
    }
  }

  // Function to handle the overall upload process
  const handleUpload = async () => {
    setLoading(true)
    setFormDisabled(true)

    try {
      await handleUploadForm()
    } catch (error) {
      console.error('An unexpected error occurred:', error.message)

      // Return null or handle error as needed
      isMounted.current = false
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
    setProductTag('')
    setSellingPrice('')
    setProductStock('')
    setProductSizes([])
    setSelectedImages([])
  }

  // Styled component for the triangle shaped background image
  const TriangleImg = styled('img')({
    right: 0,
    bottom: 0,
    height: 170,
    position: 'absolute'
  })

  const handleAddMoreImages = () => {
    // Check if the maximum number of images has been reached
    if (selectedImages.length < MAX_IMAGES) {
      const fileInput = document.getElementById('imageInput')
      fileInput.click()
    } else {
      setFailed('Maximum number of images')
    }
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
              <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
            </AlertTitle>
          </Alert>
        </Grid>
      )}
      <div className='flex relative justify-between items-center p-2 flex-wrap'>
        <CardHeader title='Add Product' titleTypographyProps={{ variant: 'h6' }} />
        <Link href='/products' passHref>
          <Button sx={{ zIndex: 10 }} size='medium' variant='contained'>
            <KeyboardBackspaceIcon className='mr-2' />
            All Products
          </Button>
        </Link>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {selectedImages &&
                  selectedImages.map((image, index) => (
                    <Box key={index}>
                      <ButtonStyled component='label' variant='text'>
                        {image && (
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Selected Image ${index + 1}`}
                            style={{ width: '60px', height: '60px', marginRight: '8px', borderRadius: '5px' }}
                          />
                        )}
                        <input
                          hidden
                          disabled={formDisabled}
                          type='file'
                          onChange={e => {
                            const file = e.target.files[0]
                            setSelectedImages(prevImages => [...prevImages, file])
                          }}
                          id={`image${index + 1}`}
                        />
                        <Button
                          size='small'
                          color='error'
                          disabled={formDisabled}
                          onClick={() => {
                            setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index))
                          }}
                        >
                          <CloseRoundedIcon />
                        </Button>
                      </ButtonStyled>
                    </Box>
                  ))}
                <Box>
                  <ButtonStyled variant='text' onClick={handleAddMoreImages} disabled={formDisabled}>
                    <AddRoundedIcon sx={{ width: '50px', height: '50px' }} />
                    Add Image
                  </ButtonStyled>
                  <input
                    hidden
                    type='file'
                    id='imageInput'
                    onChange={e => {
                      const file = e.target.files[0]
                      setSelectedImages(prevImages => [...prevImages, file])
                    }}
                  />
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
                placeholder='Input Product Description/Details'
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
                placeholder='e.g., 50000'
                id='sellingPrice'
                name='sellingPrice'
                type='tel'
                disabled={formDisabled}
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
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
                  <MenuItem value=''>None</MenuItem>
                  <MenuItem value='shoe'>Shoe</MenuItem>
                  <MenuItem value='bag'>Bag</MenuItem>
                  <MenuItem value='phone'>Phone</MenuItem>
                  <MenuItem value='tablet'>Tablet</MenuItem>
                  <MenuItem value='laptop'>Laptop</MenuItem>
                  <MenuItem value='kids'>Kids Wear</MenuItem>
                  <MenuItem value='adultMen'>Adults Wear (Men)</MenuItem>
                  <MenuItem value='adultWomen'>Adults Wear (Women)</MenuItem>
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
            <Grid container item xs={12} sm={6}>
              {productSizes.map((size, index) => (
                <div className='flex items-center my-1' key={index}>
                  <TextField
                    fullWidth
                    type='text'
                    label={`Product Size`}
                    placeholder={`e.g., 36/XL`}
                    value={size}
                    disabled={formDisabled}
                    onChange={e => handleSizeChange(index, e.target.value)}
                  />
                  <CloseRoundedIcon className='cursor-pointer mx-2' onClick={() => handleRemoveSize(index)} />
                </div>
              ))}
              <div className='flex items-center my-2'>
                <Button onClick={handleAddSize} variant='outlined' size='small'>
                  <AddRoundedIcon />
                  new size
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <LoadingButton
            loading={Boolean(isLoading)}
            disabled={isDisabled}
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

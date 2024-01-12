import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import axios from 'axios'
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
import { useUser } from 'src/@core/context/userDataContext'
import Link from 'next/link'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FormData from 'form-data'

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const url = process.env.URL

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
  const [formDisabled, setFormDisabled] = useState(false)
  const [productSizes, setProductSizes] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [selectedImages, setSelectedImages] = useState([])
  const [sizes, setSizes] = useState([])

  const MAX_IMAGES = 4 // Maximum number of images allowed

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

  const user_id = userData?.id
  const email = userData?.email
  const store_name_id = userData?.store_name_id
  const store_bucket_id = userData?.store_bucket_id
  const subscription = userData?.subscription

  const uploadImage = async index => {
    try {
      const file = selectedImages[index]

      if (!file) {
        return null
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        ` https://craftserver.onrender.com/v1/api/uploadfile?id=${user_id}&store_bucket_id=${store_bucket_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const { error, url } = response.data

      if (error) {
        setFailed(error.message)

        return null
      }

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

      const ImgUrls = await Promise.all(selectedImages.map((_, index) => uploadImage(index)))

      // Check if ImgUrls is null
      if (!ImgUrls) {
        setFailed('Error uploading images')
      }

      // Prepare an array to store individual data objects
      const formData = {
        user_id,
        name: productName,
        description: productDescription,
        price: sellingPrice,
        size: sizes,
        tag: productTag,
        email,
        stock: productStock,
        date,
        uploaded_image_urls: ImgUrls
      }

      const response = await axios.post(` https://craftserver.onrender.com/v1/api/insert?store_name_id=${store_name_id}`, {
        formData
      })

      const { error } = response.data

      if (error) {
        setFailed(error.message)

        return null
      } else {
        setFailed('')
        setSuccess('Product Uploaded successfully!')

        clearForm()
        window.location.reload(true)
      }
    } catch (error) {
      setFailed(error.message)
    } finally {
    }
  }

  useEffect(() => {
    if (store_name_id) {
      handleDataCount()
    }
  }, [store_name_id])

  // Function to fetch product count
  const handleDataCount = async () => {
    try {
      const response = await axios.get(` https://craftserver.onrender.com/v1/api/fetch?store_name_id=${store_name_id}`)

      const { error, data } = response.data

      if (error) {
        setFailed(error.message)

        return null
      } else {
        const dataCount = data ? data.length : 0

        setProductCount(dataCount)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle the overall upload process
  const handleUpload = async () => {
    setLoading(true)
    setFormDisabled(true)

    await handleDataCount()

    try {
      let subscriptionLimit
      switch (subscription) {
        case 'Free':
          subscriptionLimit = 0
          break
        case 'Trial':
          subscriptionLimit = 4
          break
        case 'Basic':
          subscriptionLimit = 50
          break
        case 'Premium':
          subscriptionLimit = 100
          break
        default:
          subscriptionLimit = 0
          break
      }

      // Check if the user has reached the subscription limit
      if (productCount >= subscriptionLimit) {
        setFailed(`You have reached the maximum of ${subscriptionLimit} products for your subscription.`)

        return
      } else {
        await uploadImage()
        await handleUploadForm()
      }
    } catch (error) {
      setFailed(error.message)
    } finally {
      // Reset success and failure after a delay
      setTimeout(() => {
        setSuccess('')
        setFailed('')
      }, 8000)

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
    setSizes([])
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
          <Alert variant='filled' severity='success' sx={{ '& a': { fontWeight: 500, color: 'white' } }}>
            <span className='text-white'> {success}</span>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, right: 0, zIndex: 55 }}>
          <Alert variant='filled' severity='error' sx={{ '& a': { fontWeight: 500 } }}>
            <span className='text-white'>{failed}</span>
            <CloseRoundedIcon className=' cursor-pointer  mx-2' onClick={() => setFailed('')} />
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
                    <AddRoundedIcon sx={{ width: '50px', height: '50px' }} disabled={formDisabled} />
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
                placeholder='Product Name'
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
                placeholder='Product Description/Details'
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
                <InputLabel id='form-layouts-separator-select-label'>Product Category</InputLabel>
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
                  <MenuItem value='Clothing Fashion'>Clothing and Fashion</MenuItem>
                  <MenuItem value='Footwear'>Footwear</MenuItem>
                  <MenuItem value='Accessories'>Accessories</MenuItem>
                  <MenuItem value='Electronics'>Electronics</MenuItem>
                  <MenuItem value='Pet Supply'>Pet Supply</MenuItem>
                  <MenuItem value='Home Living'>Home and Living</MenuItem>
                  <MenuItem value='Beauty Care'>Beauty and Personal Care</MenuItem>
                  <MenuItem value='Sports Outdoors'>Sports and Outdoors</MenuItem>
                  <MenuItem value='Books Music Media'>Books, Music and Media </MenuItem>
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
              <FormControl fullWidth>
                <TextField
                  label='Sizes (max 10)'
                  type='text'
                  disabled={formDisabled}
                  placeholder='e.g., 40,XL,45'
                  value={sizes}
                  onChange={e => {
                    const inputSizes = e.target.value.split(',').map(item => item.trim())

                    if (inputSizes.length <= 10) {
                     setSizes(inputSizes.map(size => size.toUpperCase()));
                    }
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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

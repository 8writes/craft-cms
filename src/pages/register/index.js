// ** React Imports
import { useState, Fragment } from 'react'
import { useRouter } from 'next/router'

// ** Import Supabase client
import { createClient } from '@supabase/supabase-js'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// ** Icons
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Connect supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useUser } from 'src/@core/context/userDataContext'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  const router = useRouter()

  // ** States
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [checkbox, setCheckbox] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const isDisabled = !email || !password || !firstName || !lastName || !checkbox || !storeName

  const handleCheckboxChange = e => {
    setCheckbox(e.target.checked)
  }

  // ** Hook

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handlePasswordChange = e => {
    const value = e.target.value

    // Special characters password check
    const hasSpecialCharacters = /[!@#$%^&*()_+{}\[\]:<>,.?~\\]/.test(value)
    setPassword(value)
    if (value.length >= 6 && hasSpecialCharacters) {
      setPasswordError('') // Reset password error if it meets the criteria
    } else {
      setPasswordError('Password must be at least 6 characters long and contain special characters')
    }
  }

  // ** API call
  const handleSignup = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            store_name: storeName,
            subscription: 'Free Plan'
          }
        }
      })
    
      if (error) {
        // Handle login error
        setFailed(error.message)
      } else {
        // Handle login success
        setSuccess('Account created successfully!')
    setFailed('')
         setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
    } catch (error) {
      console.error('Unexpected error during login:', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Box className='content-center relative'>
      {success && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, zIndex: 55 }}>
          <Alert severity='success' sx={{ '& a': { fontWeight: 400 } }}>
            <AlertTitle>Account created successfully</AlertTitle>
          </Alert>
        </Grid>
      )}
      {failed && (
        <Grid item xs={7} sx={{ m: 3, position: 'fixed', top: 0, zIndex: 55 }}>
          <Alert severity='warning' sx={{ '& a': { fontWeight: 400 } }}>
            <AlertTitle>An account with this email exist</AlertTitle>
          </Alert>
        </Grid>
      )}
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 6,
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Create an account
            </Typography>
            <Typography variant='body2'>Makes store management easy and Insightful!</Typography>
          </Box>
          <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()} method='POST'>
            <TextField
              autoFocus
              name='firstName'
              type='text'
              fullWidth
              value={firstName}
               placeholder='Jack'
              onChange={e => setFirstName(e.target.value)}
              id='firstName'
              label='First Name'
              sx={{ marginBottom: 4 }}
            />
            <TextField
              name='lastName'
              type='text'
              fullWidth
              value={lastName}
               placeholder='Doe'
              onChange={e => setLastName(e.target.value)}
              id='lastName'
              label='Last Name'
              sx={{ marginBottom: 4 }}
            />
            <TextField
              fullWidth
              name='email'
              type='email'
              value={email}
              placeholder='dave@example.com'
              onChange={e => setEmail(e.target.value)}
              label='Email'
              sx={{ marginBottom: 4 }}
            />
             <TextField
              name='storeName'
              type='text'
              fullWidth
              value={storeName}
              placeholder='royeshoesplug'
              onChange={e => setStoreName(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
              id='storeName'
              label='Store Name'
              sx={{ marginBottom: 4 }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                name='password'
                id='auth-register-password'
                value={password}
                onChange={handlePasswordChange}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {passwordError && (
                <Typography variant='subtitle2' sx={{ marginTop: 5, color: 'red', fontWeight: '600' }}>
                  {passwordError}
                </Typography>
              )}
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={checkbox} onChange={handleCheckboxChange} />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href='/' passHref>
                    <LinkStyled onClick={e => e.preventDefault()}>privacy policy & terms</LinkStyled>
                  </Link>
                </Fragment>
              }
            />
            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              onClick={handleSignup}
              loading={isLoading}
              disabled={isDisabled}
              variant='contained'
              sx={{ marginBottom: 7 }}
            >
              Sign up
            </LoadingButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/login'>
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage

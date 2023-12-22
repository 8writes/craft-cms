// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>{`© ${new Date().getFullYear()}, SYNCSTORE `}</Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/LICENSE'
          >
          
          </Link>
          <Link target='_blank' href='https://themeselection.com/'>
          </Link>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/README.md'
          >
           
          </Link>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/issues'
          >
            
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent

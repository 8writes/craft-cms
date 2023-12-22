// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CogOutline from 'mdi-material-ui/CogOutline'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded'
import AddIcon from '@mui/icons-material/Add';

const navigation = () => {
  

  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      sectionTitle: 'My Store'
    },
    {
      icon: CategoryRoundedIcon,
      title: 'Products',
      path: '/products'
    },
    {
      icon: AddIcon,
      title: 'Add product',
      path: '/add-new-product'
    },
    {
      icon: ListAltRoundedIcon,
      title: 'Orders',
      path: '#'
    },
    {
      sectionTitle: 'User Account'
    },
    {
      icon: AccountOutline,
      title: 'Profile',
      path: '/profile'
    },
    {
      title: 'Settings',
      icon: CogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'Customer Support',
    },
    {
      title: 'Support',
      icon: LiveHelpRoundedIcon,
      path: '#',
    }
  ]
}

export default navigation

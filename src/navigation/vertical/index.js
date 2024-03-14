// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CogOutline from 'mdi-material-ui/CogOutline'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import AddIcon from '@mui/icons-material/Add'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
 
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
      path: '/orders'
    },
    {
      sectionTitle: 'User Account'
    },
    {
      icon: AccountOutline,
      title: 'Account',
      path: '/profile'
    },
    {
      title: 'Settings',
      icon: CogOutline,
      path: '/account-settings'
    },
     {
      icon: StoreRoundedIcon,
      title: 'Manage Store',
      path: '#'
    },
    {
      sectionTitle: 'Customer Care'
    },
    {
      title: 'Support',
      icon: SupportAgentRoundedIcon,
      path: '#'
    },
    {
      title: 'How To?',
      icon: QuizRoundedIcon,
      path: '#'
    },
    {
      title: 'About',
      icon: InfoRoundedIcon,
      path: '#'
    }
  ]
}

export default navigation

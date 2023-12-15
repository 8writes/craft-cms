// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CogOutline from 'mdi-material-ui/CogOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

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
      icon: InformationOutline,
      title: 'Products',
      path: '/products'
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
      icon: InformationOutline,
      path: '#'
    }
  ]
}

export default navigation

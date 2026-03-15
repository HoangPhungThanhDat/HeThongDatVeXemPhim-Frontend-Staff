import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Hotrokhachhang from "views/admin/hotrokhachhang";
import Profile from 'views/admin/profile';
import Quanlyve from 'views/admin/quanlyve';
import Quanlysuatchieu from "views/admin/quanlysuatchieu";
import Thongke from "views/admin/thongke";
import Quanlyphim from "views/admin/quanlyphim";

// Auth Imports
import SignInCentered from 'views/auth/signIn';
//icons
import { MdMovie } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import { MdSchedule } from "react-icons/md";
import { MdConfirmationNumber } from "react-icons/md";


const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: "Quản lý phim",
    layout: '/admin',
    path: "/quan-ly-phim",
    icon: (
      <Icon
  as={MdMovie}
  width="20px"
  height="20px"
  color="inherit"
/>

    ),
    component: <Quanlyphim />,
    secondary: true,
  },
  {
    name: "Hỗ trợ khách hàng",
    layout: '/admin',
    path: "/ho-tro-khach-hang",
    icon: (
      <Icon
  as={MdSupportAgent}
  width="20px"
  height="20px"
  color="inherit"
/>

    ),
    component: <Hotrokhachhang />,
    secondary: true,
  },
   {
    name: "Quản lý suất chiếu",
    layout: '/admin',
    path: "/quan-ly-suat-chieu",
    icon: (
      <Icon
  as={MdSchedule}
  width="20px"
  height="20px"
  color="inherit"
/>

    ),
    component: <Quanlysuatchieu />,
    secondary: true,
  },
  {
    name: 'Quản lý vé',
    layout: '/admin',
   icon: (
  <Icon
    as={MdConfirmationNumber}
    width="20px"
    height="20px"
    color="inherit"
  />
),

    path: '/quan-ly-ve',
    component: <Quanlyve />,
  },
  {
    name: 'Thống kê',
    layout: '/admin',
    icon: (
  <Icon
    as={MdBarChart}
    width="20px"
    height="20px"
    color="inherit"
  />
),

    path: '/thong-ke',
    component: <Thongke />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
 
];

export default routes;

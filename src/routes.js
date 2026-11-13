import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  LuLock,
  LuHeadset,
  LuShoppingCart,
  LuScanLine,
  LuSearch,
  LuCircleUserRound, // Đã sửa từ LuUserCircle -> LuCircleUserRound
  LuStore,
  LuLayoutDashboard,
} from 'react-icons/lu';

// ─── Staff Imports ──────────────────────────────────────────────
import DashboardCa from 'views/staff/default';              
import BanVe from 'views/staff/banve';                      
import Checkin from 'views/staff/checkin';                  
import Quanlydonhang from 'views/staff/quanlydonhang';      
import Tracuu from 'views/staff/tracuu';                    
import Hotrokhachhang from 'views/staff/hotrokhachhang';    
import Profile from 'views/staff/profile';                  

// Auth Imports
import SignInCentered from 'views/auth/signIn';

// Helper tạo icon cho gọn
// strokeWidth={2} giúp nét vẽ đậm vừa phải, không bị mảnh quá
const icon = (IconComponent) => (
  <Icon as={IconComponent} width="20px" height="20px" color="inherit" strokeWidth={2} />
);

const routes = [
  // ─── AUTH (ẩn khỏi sidebar) ──────────────────────────────────────
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: icon(LuLock),
    component: <SignInCentered />,
    hidden: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🟦 SECTION: VẬN HÀNH — Nghiệp vụ chính
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'VẬN HÀNH' },

  {
    name: 'Tổng quan ca',
    layout: '/staff',
    path: '/default',
    icon: icon(LuLayoutDashboard),
    component: <DashboardCa />,
  },
  {
    name: 'Bán vé tại quầy',
    layout: '/staff',
    path: '/ban-ve',
    icon: icon(LuStore),
    component: <BanVe />,
  },
  {
    name: 'Soát vé (Check-in)',
    layout: '/staff',
    path: '/check-in',
    icon: icon(LuScanLine),
    component: <Checkin />,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🟨 SECTION: GIAO DỊCH — Đơn hàng & Tra cứu
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'GIAO DỊCH' },

  {
    name: 'Đơn hàng',
    layout: '/staff',
    path: '/don-hang',
    icon: icon(LuShoppingCart),
    component: <Quanlydonhang />,
  },
  {
    name: 'Tra cứu',
    layout: '/staff',
    path: '/tra-cuu',
    icon: icon(LuSearch),
    component: <Tracuu />,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🟥 SECTION: HỆ THỐNG — Hỗ trợ & Cá nhân
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'HỆ THỐNG' },

  {
    name: 'Hỗ trợ khách hàng',
    layout: '/staff',
    path: '/ho-tro-khach-hang',
    icon: icon(LuHeadset),
    component: <Hotrokhachhang />,
  },
  {
    name: 'Profile cá nhân',
    layout: '/staff',
    path: '/profile',
    icon: icon(LuCircleUserRound), // Đã cập nhật tên icon chuẩn
    component: <Profile />,
  },
];

export default routes;
import React from 'react';
import {
  User,
  Lock,
  Mail,
  Search,
  ShoppingCart,
  Trash,
  Edit,
  Plus,
  Home,
  Store,
  Menu,
  LogOut,
  Table,
  Building2,
  Upload,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUp,
  Facebook,
  XCircle,
  History,
  Phone,
  Book,
  Settings,
  Crown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Export all icons
export const Icons = {
  UserOutlined: User,
  LockOutlined: Lock,
  MailOutlined: Mail,
  SearchOutlined: Search,
  ShoppingCartOutlined: ShoppingCart,
  DeleteOutlined: Trash,
  EditOutlined: Edit,
  PlusOutlined: Plus,
  HomeOutlined: Home,
  ShopOutlined: Store,
  MenuOutlined: Menu,
  LogoutOutlined: LogOut,
  TableOutlined: Table,
  ApartmentOutlined: Building2,
  UploadOutlined: Upload,
  ShoppingOutlined: ShoppingBag,
  DollarOutlined: DollarSign,
  RiseOutlined: TrendingUp,
  ClockCircleOutlined: Clock,
  ArrowUpOutlined: ArrowUp,
  FacebookOutlined: Facebook,
  CloseCircleOutlined: XCircle,
  HistoryOutlined: History,
  PhoneOutlined: Phone,
  BookOutlined: Book,
  SettingOutlined: Settings,
  CrownOutlined: Crown
} as const;

// Wrapper function to handle icon rendering with proper types
export const renderIcon = (IconComponent: LucideIcon, className?: string): React.ReactElement => {
  return React.createElement(IconComponent, { className });
}; 
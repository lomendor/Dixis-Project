import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Modal, 
  message, 
  Skeleton, 
  Input, 
  Space, 
  Tooltip,
  DatePicker,
  Select
} from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { InfoCircleOutlined, ReloadOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface SellerData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

export const SellerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [orderStatus, setOrderStatus] = useState<string>('all');

  // ... rest of the component code
}; 
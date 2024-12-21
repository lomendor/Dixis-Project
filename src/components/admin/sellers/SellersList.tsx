import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Card, message, Tooltip } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@/components/common/IconWrapper';
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './SellersList.css';

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  managedProducers: number;
  totalCommission: number;
  createdAt: string;
}

export function SellersList() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    const filtered = sellers.filter(seller => 
      seller.name.toLowerCase().includes(searchText.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSellers(filtered);
  }, [sellers, searchText]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sellers');
      if (response.data.status === 'success') {
        setSellers(response.data.data);
        setFilteredSellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      message.error('Σφάλμα κατά την ανάκτηση των πωλητών');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/sellers/${id}`);
      if (response.data.status === 'success') {
        message.success('Ο πωλητής διαγράφηκε επιτυχώς');
        fetchSellers();
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
      message.error('Σφάλμα κατά τη διαγραφή του πωλητή');
    }
  };

  const columns: ColumnsType<Seller> = [
    {
      title: 'Πωλητής',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Seller) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Τηλέφωνο',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Παραγωγοί',
      dataIndex: 'managedProducers',
      key: 'managedProducers',
      render: (count: number) => count,
      sorter: (a, b) => a.managedProducers - b.managedProducers,
    },
    {
      title: 'Συνολική Προμήθεια',
      dataIndex: 'totalCommission',
      key: 'totalCommission',
      render: (value: number) => `${value.toFixed(2)}€`,
      sorter: (a, b) => a.totalCommission - b.totalCommission,
    },
    {
      title: 'Ημ/νία Εγγραφής',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Κατάσταση',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`status-badge ${status}`}>
          {status === 'active' ? 'Ενεργός' : 'Ανενεργός'}
        </span>
      ),
    },
    {
      title: 'Ενέργειες',
      key: 'actions',
      render: (_: any, record: Seller) => (
        <Space size="middle">
          <Link to={`/admin/sellers/${record._id}`}>
            <Tooltip title="Προβολή">
              <Button 
                type="text" 
                icon={<UserOutlined />}
              />
            </Tooltip>
          </Link>
          <Tooltip title="Επεξεργασία">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => console.log('Edit:', record._id)} 
            />
          </Tooltip>
          <Tooltip title="Διαγραφή">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Πωλητές</span>
            <Space>
              <Input
                placeholder="Αναζήτηση πωλητή..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/sellers/new')}
              >
                Νέος Πωλητής
              </Button>
            </Space>
          </div>
        }
      >
        <Table<Seller>
          columns={columns}
          dataSource={filteredSellers}
          rowKey="_id"
          loading={loading}
          pagination={{
            total: filteredSellers.length,
            pageSize: 10,
            showTotal: (total) => `Σύνολο ${total} πωλητές`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
} 
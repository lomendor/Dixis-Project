import React from 'react';
import { Table, Button, InputNumber, Empty, Typography } from 'antd';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import { Icons, renderIcon } from '../common/icons';

const { Title } = Typography;

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem } = useCart();

  const columns = [
    {
      title: 'Προϊόν',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Τιμή',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toFixed(2)}€`,
    },
    {
      title: 'Ποσότητα',
      key: 'quantity',
      render: (_: any, record: any) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.id, value || 1)}
        />
      ),
    },
    {
      title: 'Σύνολο',
      key: 'total',
      render: (record: any) => `${(record.price * record.quantity).toFixed(2)}€`,
    },
    {
      title: 'Ενέργειες',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="text"
          danger
          icon={renderIcon(Icons.DeleteOutlined)}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Το καλάθι σας είναι άδειο"
        >
          <Link to="/products">
            <Button type="primary" icon={renderIcon(Icons.ShoppingOutlined)}>
              Συνέχεια αγορών
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>Καλάθι Αγορών</Title>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        footer={() => (
          <div className="text-right">
            <strong>Σύνολο: {total.toFixed(2)}€</strong>
          </div>
        )}
      />
      <div className="mt-4 text-right">
        <Link to="/checkout">
          <Button type="primary" size="large">
            Ολοκλήρωση Παραγγελίας
          </Button>
        </Link>
      </div>
    </div>
  );
}; 
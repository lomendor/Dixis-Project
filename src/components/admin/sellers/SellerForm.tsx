import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface SellerFormData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  commission: number;
}

export function SellerForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchSellerData();
    }
  }, [id]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sellers/${id}`);
      if (response.data.status === 'success') {
        const seller = response.data.data;
        form.setFieldsValue({
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          status: seller.status,
          commission: seller.commission
        });
      }
    } catch (error) {
      console.error('Error fetching seller:', error);
      message.error('Σφάλμα κατά την ανάκτηση των στοιχείων του πωλητή');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: SellerFormData) => {
    try {
      setLoading(true);
      const url = isEditing ? `/api/sellers/${id}` : '/api/sellers';
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios[method](url, values);
      
      if (response.data.status === 'success') {
        message.success(
          isEditing 
            ? 'Ο πωλητής ενημερώθηκε επιτυχώς' 
            : 'Ο πωλητής δημιουργήθηκε επιτυχώς'
        );
        navigate('/admin/sellers');
      }
    } catch (error) {
      console.error('Error saving seller:', error);
      message.error(
        isEditing 
          ? 'Σφάλμα κατά την ενημέρωση του πωλητή' 
          : 'Σφάλμα κατά τη δημιουργία του πωλητή'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {isEditing ? 'Επεξεργασία Πωλητή' : 'Νέος Πωλητής'}
          </span>
        </div>
      }>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
            commission: 10
          }}
        >
          <Form.Item
            name="name"
            label="Ονοματεπώνυμο"
            rules={[{ required: true, message: 'Το ονοματεπώνυμο είναι υποχρεωτικό' }]}
          >
            <Input placeholder="π.χ. Γιώργος Παπαδόπουλος" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Το email είναι υποχρεωτικό' },
              { type: 'email', message: 'Το email δεν είναι έγκυρο' }
            ]}
          >
            <Input placeholder="π.χ. example@dixis.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Τηλέφωνο"
            rules={[
              { required: true, message: 'Το τηλέφωνο είναι υποχρεωτικό' },
              { pattern: /^[0-9]{10}$/, message: 'Το τηλέφωνο πρέπει να έχει 10 ψηφία' }
            ]}
          >
            <Input placeholder="π.χ. 6912345678" />
          </Form.Item>

          <Form.Item
            name="commission"
            label="Ποσοστό Προμήθειας (%)"
            rules={[
              { required: true, message: 'Το ποσοστό προμήθειας είναι υποχρεωτικό' },
              { type: 'number', min: 0, max: 100, message: 'Το ποσοστό πρέπει να είναι μεταξύ 0 και 100' }
            ]}
          >
            <Input type="number" min={0} max={100} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Κατάσταση"
            rules={[{ required: true, message: 'Η κατάσταση είναι υποχρεωτική' }]}
          >
            <Select>
              <Select.Option value="active">Ενεργός</Select.Option>
              <Select.Option value="inactive">Ανενεργός</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Ενημέρωση' : 'Δημιουργία'}
              </Button>
              <Button onClick={() => navigate('/admin/sellers')}>
                Ακύρωση
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 
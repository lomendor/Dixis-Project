import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  Select,
  Switch,
  Space,
  Spin
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import './CategoryForm.css';
import { UploadOutlined } from '@/components/common/icons';

const { TextArea } = Input;
const { Option } = Select;

const CategoryForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    categories, 
    isLoading, 
    createCategory, 
    updateCategory 
  } = useCategories();

  useEffect(() => {
    if (id && categories) {
      const category = categories.find(c => c._id === id);
      if (category) {
        form.setFieldsValue({
          name: category.name,
          description: category.description,
          parent: category.parent?._id,
          isActive: category.isActive
        });

        if (category.image) {
          setFileList([{
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: category.image,
          }]);
        }
      }
    }
  }, [id, categories, form]);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return false;
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      return false;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const onFinish = async (values: any) => {
    const formData = {
      ...values,
      image: fileList[0]?.originFileObj
    };

    try {
      if (id) {
        await updateCategory.mutateAsync({ id, data: formData });
      } else {
        await createCategory.mutateAsync(formData);
      }
      navigate('/admin/categories');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading && id) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title={id ? 'Επεξεργασία Κατηγορίας' : 'Νέα Κατηγορία'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true }}
      >
        <Form.Item
          name="name"
          label="Όνομα"
          rules={[
            { required: true, message: 'Παρακαλώ εισάγετε όνομα' },
            { max: 50, message: 'Το όνομα δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Περιγραφή"
          rules={[
            { max: 500, message: 'Η περιγραφή δεν μπορεί να υπερβαίνει τους 500 χαρακτήρες' }
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="parent"
          label="Γονική Κατηγορία"
        >
          <Select
            allowClear
            placeholder="Επιλέξτε γονική κατηγορία"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {categories
              ?.filter(cat => cat._id !== id) // Exclude current category
              .map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Εικόνα"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined style={{ fontSize: 20 }} />
                <div style={{ marginTop: 8 }}>Ανέβασμα</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Ενεργή"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={createCategory.isPending || updateCategory.isPending}
            >
              {id ? 'Ενημέρωση' : 'Δημιουργία'}
            </Button>
            <Button onClick={() => navigate('/admin/categories')}>
              Ακύρωση
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategoryForm; 
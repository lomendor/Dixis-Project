import React, { useState, useEffect } from 'react';
import { Button, Table, Tree, Space, Switch, Popconfirm, Image, Card, Spin } from 'antd';
import type { TreeProps, DataNode } from 'antd/es/tree';
import { useNavigate } from 'react-router-dom';
import { Icons, renderIcon } from '../../common/icons';
import { useCategories } from '../../../hooks/useCategories';
import './CategoriesList.css';

interface Category {
  _id: string;
  name: string;
  image?: string;
  isActive: boolean;
  children?: Category[];
}

export const CategoriesList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('tree');
  const navigate = useNavigate();
  const { categories, categoryTree, isLoading, updateStatus, deleteCategory, updateOrder } = useCategories();

  const handleStatusChange = async (id: string, status: boolean, name: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDrop: TreeProps['onDrop'] = async (info: any) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');

    const loop = (
      data: Category[],
      key: string,
      callback: (item: Category, index: number, arr: Category[]) => void
    ) => {
      data.forEach((item, index, arr) => {
        if (item._id === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };

    const data = [...(categoryTree || [])];
    let dragObj: Category | undefined;

    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!dragObj) {
      return;
    }

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else {
      let ar: Category[] = [];
      let i: number = -1;
      
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (i > -1) {
        if (dropPos[dropPos.length - 1] === '1') {
          ar.splice(i + 1, 0, dragObj);
        } else {
          ar.splice(i, 0, dragObj);
        }
      }
    }

    try {
      await updateOrder.mutateAsync(
        data.map((cat, index) => ({
          _id: cat._id,
          order: index,
          parent: cat.parent?._id
        }))
      );
    } catch (error) {
      console.error('Error updating category order:', error);
    }
  };

  const convertToTreeData = (data: Category[]): DataNode[] => {
    return data.map(item => ({
      key: item._id,
      title: (
        <Space>
          {item.image && <Image src={item.image} width={30} />}
          <span>{item.name}</span>
          <Switch
            size="small"
            checked={item.isActive}
            onChange={(checked) => handleStatusChange(item._id, checked, item.name)}
          />
          <Button
            size="small"
            icon={renderIcon(Icons.EditOutlined)}
            onClick={() => navigate(`/admin/categories/edit/${item._id}`)}
          />
          <Popconfirm
            title="Είστε σίγουροι;"
            onConfirm={() => handleDelete(item._id)}
            okText="Ναι"
            cancelText="Όχι"
          >
            <Button size="small" icon={renderIcon(Icons.DeleteOutlined)} danger />
          </Popconfirm>
        </Space>
      ),
      children: item.children ? convertToTreeData(item.children) : []
    }));
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      title="Διαχείριση Κατηγοριών"
      extra={
        <Space>
          <Button
            icon={renderIcon(Icons.TableOutlined)}
            type={viewMode === 'table' ? 'primary' : 'default'}
            onClick={() => setViewMode('table')}
          >
            Πίνακας
          </Button>
          <Button
            icon={renderIcon(Icons.ApartmentOutlined)}
            type={viewMode === 'tree' ? 'primary' : 'default'}
            onClick={() => setViewMode('tree')}
          >
            Δέντρο
          </Button>
          <Button
            type="primary"
            icon={renderIcon(Icons.PlusOutlined)}
            onClick={() => navigate('/admin/categories/new')}
          >
            Νέα Κατηγορία
          </Button>
        </Space>
      }
    >
      {viewMode === 'tree' ? (
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          onDrop={handleDrop}
          treeData={convertToTreeData(categories || [])}
        />
      ) : (
        <Table
          dataSource={categories}
          columns={[
            {
              title: 'Εικόνα',
              dataIndex: 'image',
              key: 'image',
              render: (image) => image && <Image src={image} width={50} />,
            },
            {
              title: 'Όνομα',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Κατάσταση',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive, record) => (
                <Switch
                  checked={isActive}
                  onChange={(checked) => handleStatusChange(record._id, checked, record.name)}
                />
              ),
            },
            {
              title: 'Ενέργειες',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button
                    icon={renderIcon(Icons.EditOutlined)}
                    onClick={() => navigate(`/admin/categories/edit/${record._id}`)}
                  />
                  <Popconfirm
                    title="Είστε σίγουροι;"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Ναι"
                    cancelText="Όχι"
                  >
                    <Button icon={renderIcon(Icons.DeleteOutlined)} danger />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      )}
    </Card>
  );
};

export default CategoriesList; 
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Button, Rate, Spin, Image, message } from 'antd';
import { Icons, renderIcon } from '../common/icons';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { Product, CartItem } from '../../types';
import { motion } from 'framer-motion';

export const ProductDetails = () => {
  const { id } = useParams();
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [products, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Φόρτωση προϊόντος..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">Το προϊόν δεν βρέθηκε</h2>
        <Button type="primary" onClick={() => window.history.back()} className="mt-4">
          Επιστροφή
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    try {
      const cartItem: CartItem = {
        productId: product._id,
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
        producerId: product.producer._id,
        producerName: product.producer.name
      };
      addItem(cartItem);
      message.success('Το προϊόν προστέθηκε στο καλάθι!');
    } catch (error) {
      message.error('Υπήρξε ένα πρόβλημα. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Image.PreviewGroup>
            <Row gutter={[16, 16]}>
              {product.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Col span={index === 0 ? 24 : 8}>
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="rounded-lg object-cover shadow-sm hover:shadow-md transition-shadow"
                    />
                  </Col>
                </motion.div>
              ))}
            </Row>
          </Image.PreviewGroup>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold mb-4"
            >
              {product.name}
            </motion.h1>
            <div className="flex items-center mb-4">
              <Rate disabled defaultValue={product.producer.rating} />
              <span className="ml-2 text-gray-500">
                ({product.producer.reviews} κριτικές)
              </span>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold mb-4 text-blue-600"
            >
              {product.price.toFixed(2)}€
            </motion.p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Παραγωγός</h3>
              <p className="font-medium">{product.producer.name}</p>
              <p className="text-gray-500">{product.producer.location}</p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Διαθεσιμότητα</h3>
              <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'Σε απόθεμα' : 'Εξαντλήθηκε'}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="primary"
                size="large"
                icon={renderIcon(Icons.ShoppingCartOutlined)}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                block
                className="h-12 text-lg"
              >
                {product.stock > 0 ? 'Προσθήκη στο καλάθι' : 'Εξαντλήθηκε'}
              </Button>
            </motion.div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
}; 
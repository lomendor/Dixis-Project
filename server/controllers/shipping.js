import shippingService from '../services/shipping/index.js';
import Order from '../models/Order.js';

export const calculateShippingRates = async (req, res) => {
  try {
    const rates = await shippingService.calculateRates(req.body);
    res.json(rates);
  } catch (error) {
    console.error('Shipping rate calculation error:', error);
    res.status(500).json({ message: 'Failed to calculate shipping rates' });
  }
};

export const createShipment = async (req, res) => {
  try {
    const { orderId, provider, service } = req.body;
    
    const order = await Order.findById(orderId)
      .populate('user')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shipment = await shippingService.createShipment(provider, {
      sender: {
        name: order.items[0].product.producer.name,
        address: order.items[0].product.producer.address,
        postalCode: order.items[0].product.producer.postalCode,
        city: order.items[0].product.producer.city,
        phone: order.items[0].product.producer.phone,
      },
      recipient: order.shippingAddress,
      packages: [{
        weight: order.items.reduce((total, item) => 
          total + (item.product.weight * item.quantity), 0),
        // Add default dimensions if not provided
        length: 30,
        width: 20,
        height: 10,
      }],
      service,
    });

    // Update order with shipping information
    await Order.findByIdAndUpdate(orderId, {
      shipping: {
        provider,
        trackingNumber: shipment.trackingNumber,
        label: shipment.label,
      },
      status: 'shipped',
    });

    res.json(shipment);
  } catch (error) {
    console.error('Shipment creation error:', error);
    res.status(500).json({ message: 'Failed to create shipment' });
  }
};

export const getTrackingInfo = async (req, res) => {
  try {
    const { provider, trackingNumber } = req.params;
    const trackingInfo = await shippingService.getTrackingInfo(
      provider,
      trackingNumber
    );
    res.json(trackingInfo);
  } catch (error) {
    console.error('Tracking info error:', error);
    res.status(500).json({ message: 'Failed to get tracking information' });
  }
};

export const generateLabel = async (req, res) => {
  try {
    const { provider, shipmentId } = req.params;
    const label = await shippingService.generateLabel(provider, shipmentId);
    res.json(label);
  } catch (error) {
    console.error('Label generation error:', error);
    res.status(500).json({ message: 'Failed to generate shipping label' });
  }
};
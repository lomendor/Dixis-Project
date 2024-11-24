import axios from 'axios';

export default class ACSService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.ACS_API_URL,
      headers: {
        'API-Key': process.env.ACS_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async calculateRates({ origin, destination, packages }) {
    try {
      const response = await this.client.post('/shipping/rate', {
        origin_postal_code: origin.postalCode,
        destination_postal_code: destination.postalCode,
        packages: packages.map(pkg => ({
          weight: pkg.weight,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
        })),
      });

      return response.data.rates.map(rate => ({
        service: rate.service_name,
        cost: rate.total_charge,
        currency: 'EUR',
        estimatedDays: rate.estimated_days,
      }));
    } catch (error) {
      console.error('ACS rate calculation error:', error);
      throw new Error('Failed to calculate ACS shipping rates');
    }
  }

  async createShipment(params) {
    try {
      const response = await this.client.post('/shipping/shipments', {
        sender: {
          name: params.sender.name,
          address: params.sender.address,
          postal_code: params.sender.postalCode,
          city: params.sender.city,
          phone: params.sender.phone,
        },
        recipient: {
          name: params.recipient.name,
          address: params.recipient.address,
          postal_code: params.recipient.postalCode,
          city: params.recipient.city,
          phone: params.recipient.phone,
        },
        packages: params.packages,
        service: params.service,
      });

      return {
        shipmentId: response.data.shipment_id,
        trackingNumber: response.data.tracking_number,
        label: response.data.label_url,
      };
    } catch (error) {
      console.error('ACS shipment creation error:', error);
      throw new Error('Failed to create ACS shipment');
    }
  }

  async getTrackingInfo(trackingNumber) {
    try {
      const response = await this.client.get(`/tracking/${trackingNumber}`);
      return {
        status: response.data.status,
        events: response.data.events.map(event => ({
          timestamp: event.timestamp,
          location: event.location,
          status: event.status,
          description: event.description,
        })),
      };
    } catch (error) {
      console.error('ACS tracking error:', error);
      throw new Error('Failed to get ACS tracking information');
    }
  }

  async generateLabel(shipmentId) {
    try {
      const response = await this.client.get(`/shipping/labels/${shipmentId}`);
      return {
        url: response.data.label_url,
        format: 'PDF',
      };
    } catch (error) {
      console.error('ACS label generation error:', error);
      throw new Error('Failed to generate ACS shipping label');
    }
  }
}
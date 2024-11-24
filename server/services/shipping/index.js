import ACSService from './providers/acs.js';
import EltaService from './providers/elta.js';
import SpeedexService from './providers/speedex.js';

class ShippingService {
  constructor() {
    this.providers = {
      acs: new ACSService(),
      elta: new EltaService(),
      speedex: new SpeedexService(),
    };
  }

  async calculateRates(params) {
    const rates = [];
    for (const [provider, service] of Object.entries(this.providers)) {
      try {
        const providerRates = await service.calculateRates(params);
        rates.push(...providerRates.map(rate => ({
          ...rate,
          provider,
        })));
      } catch (error) {
        console.error(`Error calculating rates for ${provider}:`, error);
      }
    }
    return rates;
  }

  async createShipment(provider, params) {
    const service = this.providers[provider];
    if (!service) {
      throw new Error(`Shipping provider ${provider} not found`);
    }
    return service.createShipment(params);
  }

  async getTrackingInfo(provider, trackingNumber) {
    const service = this.providers[provider];
    if (!service) {
      throw new Error(`Shipping provider ${provider} not found`);
    }
    return service.getTrackingInfo(trackingNumber);
  }

  async generateLabel(provider, shipmentId) {
    const service = this.providers[provider];
    if (!service) {
      throw new Error(`Shipping provider ${provider} not found`);
    }
    return service.generateLabel(shipmentId);
  }
}

export default new ShippingService();
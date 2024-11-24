import React from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { stripePromise } from '../../utils/stripe';
import api from '../../utils/api';
import type { Order } from '../../types';

interface PaymentFormProps {
  order: Order;
  clientSecret: string;
}

function PaymentFormContent({ order, clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${order.id}`,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="mt-4">
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : `Pay €${order.total.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

export function PaymentForm({ order }: { order: Order }) {
  const [clientSecret, setClientSecret] = React.useState('');

  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payment/create-payment-intent', {
          amount: order.total,
          orderId: order.id,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [order]);

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
          },
        },
      }}
    >
      <PaymentFormContent order={order} clientSecret={clientSecret} />
    </Elements>
  );
}
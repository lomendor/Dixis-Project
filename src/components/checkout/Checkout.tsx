import { useState } from 'react';
import { Form, Input, Button, Steps, Card, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const { Step } = Steps;

export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();

  const steps = [
    {
      title: 'Στοιχεία Παράδοσης',
      content: (
        <Form.Item
          name="shippingAddress"
          rules={[{ required: true, message: 'Παρακαλώ συμπληρώστε τη διεύθυνση' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Διεύθυνση παράδοσης"
          />
        </Form.Item>
      ),
    },
    {
      title: 'Τρόπος Πληρωμής',
      content: (
        <Form.Item
          name="paymentMethod"
          rules={[{ required: true, message: 'Παρακαλώ επιλέξτε τρόπο πληρωμής' }]}
        >
          <Radio.Group>
            <Radio value="card">Πιστωτική/Χρεωστική κάρτα</Radio>
            <Radio value="cash">Αντικαταβολή</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: 'Επιβεβαίωση',
      content: (
        <div>
          <h3 className="font-medium mb-4">Σύνοψη Παραγγελίας</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between mb-2">
              <span>Υποσύνολο:</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>ΦΠΑ (24%):</span>
              <span>{(total * 0.24).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Σύνολο:</span>
              <span>{(total * 1.24).toFixed(2)}€</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (values: any) => {
    try {
      // TODO: Implement order submission
      message.success('Η παραγγελία σας καταχωρήθηκε επιτυχώς!');
      clearCart();
      navigate('/');
    } catch (error) {
      message.error('Υπήρξε ένα πρόβλημα με την παραγγελία σας');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Steps current={currentStep} className="mb-8">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <div className="mb-8">
            {steps[currentStep].content}
          </div>
          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button onClick={prev}>
                Προηγούμενο
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Επόμενο
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={() => form.submit()}>
                Ολοκλήρωση Παραγγελίας
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}; 
import React from 'react';
import { useParams } from 'react-router-dom';

const ProducerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Producer Profile: {id}</h1>
      {/* Producer details will go here */}
    </div>
  );
};

export default ProducerProfile;
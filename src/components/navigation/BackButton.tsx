import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
      aria-label="Επιστροφή στην προηγούμενη σελίδα"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Πίσω</span>
    </button>
  );
}
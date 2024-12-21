import { Trash2, UserCheck, UserX, Mail } from 'lucide-react';

interface ProducersBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function ProducersBulkActions({ selectedCount, onClearSelection }: ProducersBulkActionsProps) {
  return (
    <div className="border-b border-gray-100 bg-emerald-50/50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedCount} επιλεγμένοι παραγωγοί
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Καθαρισμός επιλογής
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Mail className="w-4 h-4" />
            Αποστολή Email
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors">
            <UserCheck className="w-4 h-4" />
            Ενεργοποίηση
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors">
            <UserX className="w-4 h-4" />
            Απενεργοποίηση
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
} 
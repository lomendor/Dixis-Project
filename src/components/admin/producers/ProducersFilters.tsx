import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { el } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

export function ProducersFilters() {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="border-b border-gray-100">
      <div className="p-4 flex items-center gap-4">
        {/* Βασική Αναζήτηση */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Αναζήτηση παραγωγού..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Κατάσταση */}
        <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          <option value="">Όλες οι καταστάσεις</option>
          <option value="active">Ενεργοί</option>
          <option value="pending">Σε αναμονή</option>
          <option value="disabled">Ανενεργοί</option>
        </select>

        {/* Προχωρημένα Φίλτρα Toggle */}
        <button
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Φίλτρα
        </button>
      </div>

      {/* Προχωρημένα Φίλτρα Panel */}
      {isAdvancedFiltersOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {/* Ημερομηνία Εγγραφής */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ημερομηνία Εγγραφής
              </label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
                placeholderText="Επιλέξτε εύρος ημερομηνιών"
                locale={el}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {/* Περιοχή */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Περιοχή
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-200">
                <option value="">Όλες οι περιοχές</option>
                <option value="attica">Αττική</option>
                <option value="thessaloniki">Θεσσαλονίκη</option>
                {/* Προσθέστε περισσότερες περιοχές */}
              </select>
            </div>

            {/* Αριθμός Προϊόντων */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Αριθμός Προϊόντων
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-200">
                <option value="">Όλα</option>
                <option value="0">Χωρίς προϊόντα</option>
                <option value="1-5">1-5 προϊόντα</option>
                <option value="6-20">6-20 προϊόντα</option>
                <option value="20+">20+ προϊόντα</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
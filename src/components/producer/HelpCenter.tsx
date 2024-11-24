import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '../ui/Input';

const faqCategories = [
  {
    title: 'Διαχείριση Προϊόντων',
    questions: [
      'Πώς προσθέτω ένα νέο προϊόν;',
      'Πώς ενημερώνω το απόθεμα;',
      'Πώς προσθέτω εικόνες προϊόντων;',
    ],
  },
  {
    title: 'Παραγγελίες & Αποστολές',
    questions: [
      'Πώς διαχειρίζομαι τις παραγγελίες;',
      'Πώς εκτυπώνω ετικέτες αποστολής;',
      'Ποιες είναι οι επιλογές αποστολής;',
    ],
  },
  {
    title: 'Πληρωμές & Τιμολόγηση',
    questions: [
      'Πότε πληρώνομαι για τις πωλήσεις;',
      'Πώς εκδίδω τιμολόγια;',
      'Ποιες είναι οι προμήθειες;',
    ],
  },
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Κέντρο Βοήθειας</h2>
      
      <div className="mb-6">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Αναζήτηση στις συχνές ερωτήσεις..."
          icon={<Search className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <div className="space-y-6">
        {faqCategories.map((category) => (
          <div key={category.title}>
            <h3 className="font-medium text-gray-900 mb-2">{category.title}</h3>
            <div className="space-y-2">
              {category.questions.map((question) => (
                <button
                  key={question}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-600">{question}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
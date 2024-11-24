import React from 'react';
import { Store, Users, Award, Leaf } from 'lucide-react';

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Σχετικά με το Dixis</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Συνδέουμε τους καλύτερους Έλληνες παραγωγούς με καταναλωτές που αναζητούν αυθεντικά, ποιοτικά προϊόντα
        </p>
      </section>

      {/* Mission & Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Η Αποστολή μας</h2>
          <p className="text-gray-600">
            Στο Dixis, στόχος μας είναι να αναδείξουμε τον πλούτο των ελληνικών προϊόντων και να υποστηρίξουμε τους τοπικούς παραγωγούς. Δημιουργούμε μια γέφυρα μεταξύ παράδοσης και σύγχρονης αγοράς, προσφέροντας μια πλατφόρμα όπου η ποιότητα και η αυθεντικότητα συναντούν την ευκολία του ψηφιακού εμπορίου.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Οι Αξίες μας</h2>
          <p className="text-gray-600">
            Πιστεύουμε στη διαφάνεια, την ποιότητα και τη βιωσιμότητα. Κάθε προϊόν στην πλατφόρμα μας επιλέγεται προσεκτικά, διασφαλίζοντας ότι πληροί τα υψηλότερα πρότυπα ποιότητας και προέρχεται από υπεύθυνες πρακτικές παραγωγής.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Τι μας Κάνει Ξεχωριστούς</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <Store className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Επιλεγμένοι Παραγωγοί</h3>
            <p className="text-gray-600">
              Συνεργαζόμαστε μόνο με πιστοποιημένους παραγωγούς που μοιράζονται το πάθος μας για ποιότητα
            </p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Άμεση Επικοινωνία</h3>
            <p className="text-gray-600">
              Δημιουργούμε απευθείας συνδέσεις μεταξύ παραγωγών και καταναλωτών
            </p>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Εγγύηση Ποιότητας</h3>
            <p className="text-gray-600">
              Κάθε προϊόν ελέγχεται και πιστοποιείται για την ποιότητά του
            </p>
          </div>
          <div className="text-center">
            <Leaf className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Βιωσιμότητα</h3>
            <p className="text-gray-600">
              Υποστηρίζουμε βιώσιμες πρακτικές παραγωγής και συσκευασίας
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Η Ομάδα μας</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Γιώργος Παπαδόπουλος',
              role: 'Ιδρυτής & CEO',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            },
            {
              name: 'Μαρία Κωνσταντίνου',
              role: 'Διευθύντρια Παραγωγών',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            },
            {
              name: 'Νίκος Αλεξίου',
              role: 'Τεχνικός Διευθυντής',
              image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
            },
          ].map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
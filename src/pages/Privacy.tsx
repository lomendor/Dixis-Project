import React from 'react';

function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Πολιτική Απορρήτου</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Συλλογή Δεδομένων</h2>
          <p>
            Συλλέγουμε τα ακόλουθα προσωπικά δεδομένα:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Όνομα και στοιχεία επικοινωνίας</li>
            <li>Διευθύνσεις αποστολής</li>
            <li>Ιστορικό παραγγελιών</li>
            <li>Στοιχεία πληρωμών</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Χρήση Δεδομένων</h2>
          <p>
            Χρησιμοποιούμε τα δεδομένα σας για:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Επεξεργασία παραγγελιών</li>
            <li>Επικοινωνία σχετικά με παραγγελίες</li>
            <li>Βελτίωση των υπηρεσιών μας</li>
            <li>Αποστολή ενημερώσεων (με τη συγκατάθεσή σας)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Δικαιώματα Χρηστών</h2>
          <p>
            Έχετε τα ακόλουθα δικαιώματα:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Πρόσβαση στα δεδομένα σας</li>
            <li>Διόρθωση των δεδομένων σας</li>
            <li>Διαγραφή των δεδομένων σας</li>
            <li>Εξαγωγή των δεδομένων σας</li>
            <li>Ανάκληση συγκατάθεσης</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
          <p>
            Χρησιμοποιούμε cookies για:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Λειτουργικότητα της ιστοσελίδας</li>
            <li>Ανάλυση επισκεψιμότητας</li>
            <li>Βελτίωση της εμπειρίας χρήστη</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Επικοινωνία</h2>
          <p>
            Για οποιαδήποτε ερώτηση σχετικά με την προστασία των δεδομένων σας,
            επικοινωνήστε μαζί μας στο:
          </p>
          <p className="mt-2">
            Email: privacy@dixis.gr<br />
            Τηλέφωνο: +30 210 1234567
          </p>
        </section>
      </div>
    </div>
  );
}
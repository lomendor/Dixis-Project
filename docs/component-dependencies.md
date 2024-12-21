# Component Dependencies & Cleanup Guide

## Header Components

### 1. src/components/Header.tsx (Κύριο Header)
**Εξαρτήσεις:**
- `useAuth` hook
- `useCart` context
- `CartPreview` component
- Lucide icons
- React Router

**Χρησιμοποιείται από:**
- Layout components
- Main App routing

**Κατάσταση:** ✅ Διατήρηση (Κύριο header με όλες τις απαιτούμενες λειτουργίες)

### 2. src/components/layout/Header.tsx
**Εξαρτήσεις:**
- `useAuth` hook
- `useCart` hook
- Lucide icons
- React Router

**Χρησιμοποιείται από:**
- Παλαιότερα layout components
- Πιθανές αναφορές σε άλλα components

**Κατάσταση:** ⚠️ Προς αφαίρεση (Μετά από έλεγχο αναφορών)

### 3. src/components/layout/Navbar.tsx
**Εξαρτήσεις:**
- `useAuth` hook
- `useTranslation` hook
- Lucide icons
- React Router

**Χρησιμοποιείται από:**
- Πιθανές αναφορές σε παλαιότερα components

**Κατάσταση:** ⚠️ Προς αφαίρεση (Μετά από έλεγχο αναφορών)

## Authentication Components

### 1. src/components/auth/AuthModal.tsx (Κύριο Login Modal)
**Εξαρτήσεις:**
- `useAuth` hook
- `Dialog` από @headlessui/react
- Lucide icons
- React Router

**Χρησιμοποιείται από:**
- Header component
- Main navigation flow

**Κατάσταση:** ✅ Διατήρηση (Κύριο login component)

### 2. src/components/auth/Login.tsx
**Εξαρτήσεις:**
- Ant Design components
- `useAuth` context
- `Icons` component
- React Router

**Χρησιμοποιείται από:**
- Standalone login page
- Πιθανές αναφορές σε άλλα components

**Κατάσταση:** ⚠️ Προς αφαίρεση (Μετά από έλεγχο αναφορών)

### 3. src/components/auth/LoginForm.tsx
**Εξαρτήσεις:**
- React Router
- Local Storage handling

**Χρησιμοποιείται από:**
- Πιθανές αναφορές σε παλαιότερα components

**Κατάσταση:** ⚠️ Προς αφαίρεση (Μετά από έλεγχο αναφορών)

### 4. src/components/auth/Register.tsx
**Εξαρτήσεις:**
- Ant Design components
- `useAuth` hook
- `Icons` component
- React Router

**Χρησιμοποιείται από:**
- Registration flow
- Πιθανές αναφορές από auth components

**Κατάσταση:** ✅ Διατήρηση (Απαραίτητο για τη διαδικασία εγγραφής)

## Βήματα για Μελλοντικό Cleanup

1. **Φάση 1: Έλεγχος Αναφορών**
   - Χρήση grep/search για εύρεση όλων των αναφορών στα components
   - Καταγραφή των components που τα χρησιμοποιούν
   - Δημιουργία λίστας με τη σειρά αφαίρεσης

2. **Φάση 2: Δοκιμαστική Αφαίρεση**
   - Προσωρινό σχολιασμό των components προς αφαίρεση
   - Έλεγχος για σφάλματα compilation
   - Δοκιμή βασικών λειτουργιών της εφαρμογής

3. **Φάση 3: Οριστική Αφαίρεση**
   - Αφαίρεση των επιβεβαιωμένων περιττών components
   - Ενημέρωση των import statements
   - Καθαρισμός των σχετικών test files

4. **Φάση 4: Τεκμηρίωση**
   - Ενημέρωση του παρόντος αρχείου
   - Καταγραφή των αλλαγών στο CHANGELOG
   - Ενημέρωση της τεχνικής τεκμηρίωσης

## Σημειώσεις
- Πριν από κάθε αφαίρεση, δημιουργία backup branch
- Διατήρηση των test files μέχρι την οριστική αφαίρεση
- Έλεγχος για πιθανές επιπτώσεις στο routing
- Επιβεβαίωση ότι όλες οι λειτουργίες παραμένουν προσβάσιμες 
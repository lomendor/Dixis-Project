# Components Audit

## Admin Layouts
1. ✅ src/components/admin/layout/Layout.tsx (currently in use)
    - Dependencies: Chakra UI
    - Used by: App.tsx
2. ⚠️ src/components/admin/Layout.tsx (to be reviewed)
    - Dependencies: Tailwind CSS
3. ⚠️ src/components/layout/AdminLayout.tsx (to be reviewed)
    - Dependencies: Chakra UI
4. ⚠️ src/layouts/AdminLayout.tsx (to be reviewed)
    - Dependencies: Tailwind CSS

## Producers Components
1. ✅ src/components/admin/producers/ProducersList.tsx (main component)
    - Dependencies: Chakra UI
2. ⚠️ src/components/admin/Producers.tsx (to be reviewed)
    - Dependencies: Ant Design
3. ⚠️ src/components/admin/ProducersList.tsx (to be reviewed)
    - Dependencies: React Query, Tailwind CSS
4. ⚠️ src/pages/admin/Producers.tsx (to be reviewed)
    - Dependencies: React Query, Headless UI

## UI Libraries Usage
- Chakra UI
    - Used in: Layout, ProducersList
- Ant Design
    - Used in: Dashboard, Producers
- Tailwind CSS
    - Used in: Various components 
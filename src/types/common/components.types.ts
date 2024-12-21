import { ReactNode } from 'react';

// Table Types
export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: keyof T) => void;
  sortConfig?: SortConfig;
  onRowClick?: (row: T) => void;
  selectedRow?: T;
  rowActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    show?: (row: T) => boolean;
  }>;
}

// Card Types
export interface CardProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onClick?: (item: T) => void;
  actions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (item: T) => void;
    show?: (item: T) => boolean;
  }>;
}

// List Types
export interface ListProps<T> {
  items: T[];
  isLoading?: boolean;
  onItemClick?: (item: T) => void;
  selectedItem?: T;
  renderItem: (item: T) => ReactNode;
}

// Grid Types
export interface GridProps<T> {
  items: T[];
  isLoading?: boolean;
  onItemClick?: (item: T) => void;
  selectedItem?: T;
  renderItem: (item: T) => ReactNode;
  columns?: number;
  gap?: number;
}

// Stats Types
export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  color?: string;
}

export interface StatsGridProps {
  items: StatItem[];
  columns?: number;
}

// Filter Types
export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
} 
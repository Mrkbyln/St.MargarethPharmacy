import { Medicine } from './types';

export const INITIAL_MEDICINES: Medicine[] = [
  { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 15.50, stock_qty: 120, expiry_date: '2025-12-01' },
  { id: '2', name: 'Paracetamol 500mg', category: 'Analgesic', price: 5.00, stock_qty: 500, expiry_date: '2026-05-15' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Analgesic', price: 8.75, stock_qty: 8, expiry_date: '2025-08-20' }, // Low stock
  { id: '4', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 12.00, stock_qty: 45, expiry_date: '2024-02-10' }, // Expired/Soon
  { id: '5', name: 'Metformin 500mg', category: 'Antidiabetic', price: 10.00, stock_qty: 200, expiry_date: '2025-11-30' },
  { id: '6', name: 'Omeprazole 20mg', category: 'Antacid', price: 22.50, stock_qty: 5, expiry_date: '2025-10-10' }, // Low stock
  { id: '7', name: 'Vitamin C 500mg', category: 'Supplement', price: 7.00, stock_qty: 150, expiry_date: '2026-01-01' },
  { id: '8', name: 'Cough Syrup 100ml', category: 'Syrup', price: 18.00, stock_qty: 30, expiry_date: '2024-12-25' },
  { id: '9', name: 'Aspirin 81mg', category: 'Blood Thinner', price: 6.50, stock_qty: 90, expiry_date: '2025-09-15' },
  { id: '10', name: 'Loratadine 10mg', category: 'Antihistamine', price: 11.00, stock_qty: 60, expiry_date: '2025-07-20' },
];

export const CATEGORIES = [
  'Antibiotic',
  'Analgesic',
  'Antihistamine',
  'Antidiabetic',
  'Antacid',
  'Supplement',
  'Syrup',
  'Blood Thinner',
  'Other'
];
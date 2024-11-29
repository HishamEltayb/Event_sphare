import { create } from 'zustand';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  status: 'active' | 'inactive';
  deliverables: DeliverableItem[];
}

export interface DeliverableItem {
  id: string;
  eventId: string;
  supplierId: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  scheduledDeliveryDate: string;
  actualDeliveryDate?: string;
  scheduledInstallationDate: string;
  actualInstallationDate?: string;
  scheduledDismantlingDate: string;
  actualDismantlingDate?: string;
  currentStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  progressPercentage: number;
  deliveryProofDocuments?: string[];
  installationPhotos?: string[];
  dismantlingPhotos?: string[];
  supplierComments: string[];
  delayReasons?: string;
  qualityRating?: number;
}

interface SupplierStore {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  addDeliverable: (supplierId: string, deliverable: Omit<DeliverableItem, 'id'>) => void;
  updateDeliverable: (
    supplierId: string,
    deliverableId: string,
    updates: Partial<DeliverableItem>
  ) => void;
  addDeliverableComment: (
    supplierId: string,
    deliverableId: string,
    comment: string
  ) => void;
  addDeliverablePhotos: (
    supplierId: string,
    deliverableId: string,
    type: 'delivery' | 'installation' | 'dismantling',
    urls: string[]
  ) => void;
}

export const useSupplierStore = create<SupplierStore>((set) => ({
  suppliers: [],
  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [
        ...state.suppliers,
        { ...supplier, id: Math.random().toString(36).slice(2) },
      ],
    })),
  updateSupplier: (id, updates) =>
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, ...updates } : supplier
      ),
    })),
  addDeliverable: (supplierId, deliverable) =>
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              deliverables: [
                ...supplier.deliverables,
                {
                  ...deliverable,
                  id: Math.random().toString(36).slice(2),
                  supplierId,
                },
              ],
            }
          : supplier
      ),
    })),
  updateDeliverable: (supplierId, deliverableId, updates) =>
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              deliverables: supplier.deliverables.map((deliverable) =>
                deliverable.id === deliverableId
                  ? { ...deliverable, ...updates }
                  : deliverable
              ),
            }
          : supplier
      ),
    })),
  addDeliverableComment: (supplierId, deliverableId, comment) =>
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              deliverables: supplier.deliverables.map((deliverable) =>
                deliverable.id === deliverableId
                  ? {
                      ...deliverable,
                      supplierComments: [...deliverable.supplierComments, comment],
                    }
                  : deliverable
              ),
            }
          : supplier
      ),
    })),
  addDeliverablePhotos: (supplierId, deliverableId, type, urls) =>
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              deliverables: supplier.deliverables.map((deliverable) =>
                deliverable.id === deliverableId
                  ? {
                      ...deliverable,
                      [type === 'delivery'
                        ? 'deliveryProofDocuments'
                        : type === 'installation'
                        ? 'installationPhotos'
                        : 'dismantlingPhotos']: [
                        ...(deliverable[
                          type === 'delivery'
                            ? 'deliveryProofDocuments'
                            : type === 'installation'
                            ? 'installationPhotos'
                            : 'dismantlingPhotos'
                        ] || []),
                        ...urls,
                      ],
                    }
                  : deliverable
              ),
            }
          : supplier
      ),
    })),
}));
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { calculateOrderTotals } from '../utils/helpers';
import { initialReservations, kitchenTickets as seedKitchenTickets, tablesData } from '../data/restaurantData';

const AppStateContext = createContext(null);

const STORAGE_KEYS = {
  tableId: 'table_id',
  cart: 'pos-cafe-customer-cart',
  customer: 'pos-cafe-customer-details',
  reservations: 'pos-cafe-reservations',
  liveOrders: 'pos-cafe-live-orders',
};

function readStorage(key, fallback, storage) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value, storage) {
  if (typeof window === 'undefined') {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

function readTableId() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(STORAGE_KEYS.tableId);
}

function writeTableId(tableId) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!tableId) {
    window.sessionStorage.removeItem(STORAGE_KEYS.tableId);
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEYS.tableId, tableId);
}

function createReservationId(tableId) {
  return `RSV-${tableId}-${Date.now()}`;
}

function createOrderId() {
  return `ORD-${String(Date.now()).slice(-6)}`;
}

export function AppStateProvider({ children }) {
  const [selectedTableId, setSelectedTableIdState] = useState(() => readTableId());
  const [cartItems, setCartItems] = useState(() => readStorage(STORAGE_KEYS.cart, [], window.sessionStorage));
  const [customerDetails, setCustomerDetailsState] = useState(() => readStorage(STORAGE_KEYS.customer, { name: '', phone: '' }, window.sessionStorage));
  const [reservations, setReservations] = useState(() => readStorage(STORAGE_KEYS.reservations, initialReservations, window.localStorage));
  const [liveOrders, setLiveOrders] = useState(() => readStorage(STORAGE_KEYS.liveOrders, [], window.localStorage));

  useEffect(() => {
    writeTableId(selectedTableId);
  }, [selectedTableId]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cartItems, window.sessionStorage);
  }, [cartItems]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.customer, customerDetails, window.sessionStorage);
  }, [customerDetails]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.reservations, reservations, window.localStorage);
  }, [reservations]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.liveOrders, liveOrders, window.localStorage);
  }, [liveOrders]);

  const tablesWithStatus = useMemo(() => {
    const reservedTables = new Map(reservations.map((reservation) => [reservation.tableId, reservation]));

    return tablesData.map((table) => {
      const reservation = reservedTables.get(table.id);
      return {
        ...table,
        status: reservation ? 'reserved' : table.status,
        reservation,
      };
    });
  }, [reservations]);

  const groundFloorTables = useMemo(() => tablesWithStatus.filter((table) => table.id.startsWith('G')), [tablesWithStatus]);
  const firstFloorTables = useMemo(() => tablesWithStatus.filter((table) => table.id.startsWith('F')), [tablesWithStatus]);
  const totals = useMemo(() => calculateOrderTotals(cartItems), [cartItems]);

  const kitchenTickets = useMemo(
    () => [
      ...liveOrders.map((order) => ({
        id: order.id,
        tableId: order.tableId,
        status: order.status,
        items: order.items.map((item) => `${item.name} x${item.quantity}`),
        timer: 'Just now',
      })),
      ...seedKitchenTickets,
    ],
    [liveOrders],
  );

  const setSelectedTableId = (tableId) => {
    setSelectedTableIdState(tableId);
  };

  const setCustomerDetails = (nextDetails) => {
    setCustomerDetailsState((current) => ({ ...current, ...nextDetails }));
  };

  const addCartItem = (product, preferences = []) => {
    const preferenceLabel = preferences.join(' | ');
    const lineId = `${product.id}:${preferenceLabel}`;

    setCartItems((current) => {
      const existing = current.find((item) => item.lineId === lineId);

      if (existing) {
        return current.map((item) => (item.lineId === lineId ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [
        ...current,
        {
          lineId,
          id: product.id,
          name: product.name,
          category: product.category,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: 1,
          preferences,
        },
      ];
    });
  };

  const updateCartQuantity = (lineId, change) => {
    setCartItems((current) =>
      current
        .map((item) => (item.lineId === lineId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (lineId) => {
    setCartItems((current) => current.filter((item) => item.lineId !== lineId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const reserveTable = ({ tableId, name, guests, date, time }) => {
    const reservation = {
      id: createReservationId(tableId),
      tableId,
      name,
      guests,
      date,
      time,
    };

    setReservations((current) => [...current.filter((item) => item.tableId !== tableId), reservation]);
    return reservation;
  };

  const placeOrder = (paymentMethod) => {
    if (!selectedTableId || !customerDetails.name || !cartItems.length) {
      throw new Error('Add a table, customer name, and at least one item before checkout.');
    }

    const order = {
      id: createOrderId(),
      tableId: selectedTableId,
      customer: customerDetails,
      paymentMethod,
      status: 'Preparing',
      items: cartItems,
      total: totals.total,
      createdAt: new Date().toISOString(),
    };

    setLiveOrders((current) => [order, ...current]);
    setCartItems([]);
    return order;
  };

  const value = {
    selectedTableId,
    setSelectedTableId,
    customerDetails,
    setCustomerDetails,
    cartItems,
    addCartItem,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    totals,
    reservations,
    reserveTable,
    tables: tablesWithStatus,
    groundFloorTables,
    firstFloorTables,
    kitchenTickets,
    liveOrders,
    placeOrder,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider.');
  }

  return context;
}
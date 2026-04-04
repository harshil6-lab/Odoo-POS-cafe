import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { calculateOrderTotals } from '../utils/helpers';
import { getCategories, getMenuItems } from '../services/menuService';
import { createOrderWithItemsAndPayment, getOrders, updateOrderStatus } from '../services/orderService';
import { createReservation, getReservations } from '../services/reservationService';
import { supabase } from '../services/supabaseClient';
import { getTables, updateTableStatus } from '../services/tableService';

const AppStateContext = createContext(null);

const STORAGE_KEYS = {
  tableId: 'table_id',
  tableCode: 'table_code',
  cart: 'pos-cafe-customer-cart',
  customer: 'pos-cafe-customer-details',
  lastOrder: 'pos-cafe-last-order',
};

function getStorage(type) {
  if (typeof window === 'undefined') {
    return null;
  }

  return type === 'local' ? window.localStorage : window.sessionStorage;
}

function readStorage(key, fallback, type = 'session') {
  const storage = getStorage(type);

  if (!storage) {
    return fallback;
  }

  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value, type = 'session') {
  const storage = getStorage(type);

  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

function readTableId() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(STORAGE_KEYS.tableId) || window.sessionStorage.getItem(STORAGE_KEYS.tableCode);
}

function writeTableId(tableId) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!tableId) {
    window.sessionStorage.removeItem(STORAGE_KEYS.tableId);
    window.sessionStorage.removeItem(STORAGE_KEYS.tableCode);
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEYS.tableId, tableId);
  window.sessionStorage.setItem(STORAGE_KEYS.tableCode, tableId);
}

export function AppStateProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [selectedTableId, setSelectedTableIdState] = useState(() => readTableId());
  const [cartItems, setCartItems] = useState(() => readStorage(STORAGE_KEYS.cart, []));
  const [customerDetails, setCustomerDetailsState] = useState(() => readStorage(STORAGE_KEYS.customer, { name: '', phone: '' }));
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(() => readStorage(STORAGE_KEYS.lastOrder, null));

  useEffect(() => {
    writeTableId(selectedTableId);
  }, [selectedTableId]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.customer, customerDetails);
  }, [customerDetails]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.lastOrder, lastPlacedOrder);
  }, [lastPlacedOrder]);

  useEffect(() => {
    let active = true;

    const loadPublicData = async () => {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

      const results = await Promise.allSettled([
        getMenuItems(),
        getCategories(),
        getTables(),
        getReservations(),
      ]);

      if (!active) return;

      const [menuResult, categoryResult, tableResult, reservationResult] = results;

      if (menuResult.status === 'fulfilled') {
        setCatalogItems(menuResult.value);
      } else {
        console.error('Menu fetch error:', menuResult.reason);
        setCatalogItems([]);
      }

      if (categoryResult.status === 'fulfilled') {
        setCatalogCategories(categoryResult.value);
      } else {
        console.error('Categories fetch error:', categoryResult.reason);
        setCatalogCategories([]);
      }

      if (tableResult.status === 'fulfilled') {
        console.log('Tables loaded:', tableResult.value.length, 'records');
        setTables(tableResult.value);
      } else {
        console.error('Tables fetch error:', tableResult.reason);
        setTables([]);
      }

      if (reservationResult.status === 'fulfilled') {
        setReservations(reservationResult.value);
      } else {
        console.error('Reservations fetch error:', reservationResult.reason);
        setReservations([]);
      }
    };

    void loadPublicData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      if (!isAuthenticated) {
        if (active) {
          setLiveOrders([]);
        }
        return;
      }

      try {
        const orders = await getOrders({ statuses: ['pending', 'preparing', 'cooking', 'ready'] });

        if (active) {
          setLiveOrders(orders);
        }
      } catch {
        if (active) {
          setLiveOrders([]);
        }
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const tablesWithStatus = useMemo(() => {
    const reservedTables = new Map(reservations.map((reservation) => [reservation.tableId, reservation]));

    return tables.map((table) => {
      const reservation = reservedTables.get(table.id);
      return {
        ...table,
        status: reservation ? 'reserved' : table.status,
        reservation,
      };
    });
  }, [reservations, tables]);

  const groundFloorTables = useMemo(() => tablesWithStatus.filter((table) => table.id.startsWith('G')), [tablesWithStatus]);
  const firstFloorTables = useMemo(() => tablesWithStatus.filter((table) => table.id.startsWith('F')), [tablesWithStatus]);
  const totals = useMemo(() => calculateOrderTotals(cartItems), [cartItems]);

  const kitchenTickets = useMemo(
    () => (liveOrders.length
      ? liveOrders.map((order) => ({
          id: order.id,
          tableId: order.tableId,
          status: order.status,
          items: order.items.map((item) => `${item.name} x${item.quantity}`),
          timer: 'Live',
        }))
      : []),
    [liveOrders],
  );

  const findTable = (tableIdentifier) => tables.find((table) => table.id === tableIdentifier || table.dbId === tableIdentifier);

  const refreshTables = useCallback(async () => {
    const nextTables = await getTables();
    setTables(nextTables);
    return nextTables;
  }, []);

  const refreshCatalog = useCallback(async () => {
    const [menuData, categoryData] = await Promise.all([getMenuItems(), getCategories()]);
    setCatalogItems(menuData);
    setCatalogCategories(categoryData);
    return { menuData, categoryData };
  }, []);

  const refreshOrders = useCallback(async () => {
    const orders = await getOrders({ statuses: ['pending', 'preparing', 'cooking', 'ready'] });
    setLiveOrders(orders);
    return orders;
  }, []);

  const refreshReservations = useCallback(async () => {
    const nextReservations = await getReservations();
    setReservations(nextReservations);
    return nextReservations;
  }, []);

  useEffect(() => {
    const tablesChannel = supabase
      .channel('app-state-tables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => {
        void refreshTables();
      })
      .subscribe();

    const reservationsChannel = supabase
      .channel('app-state-reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        void refreshReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tablesChannel);
      supabase.removeChannel(reservationsChannel);
    };
  }, [refreshReservations, refreshTables]);

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

  const reserveTable = async ({ tableId, name, guests, date, time }) => {
    const matchedTable = tablesWithStatus.find((table) => table.id === tableId || table.dbId === tableId);
    const reservationTime = new Date(`${date}T${time}:00`).toISOString();

    const createdReservation = await createReservation({
      table_id: matchedTable?.dbId ?? tableId,
      customer_name: name,
      guests: Number(guests),
      reservation_time: reservationTime,
    });

    setReservations((current) => [...current.filter((item) => item.tableId !== createdReservation.tableId), createdReservation]);
    return createdReservation;
  };

  const placeOrder = async ({ paymentMethod, releaseTable = false } = {}) => {
    if (!selectedTableId || !cartItems.length) {
      throw new Error('Add a table and at least one item before checkout.');
    }

    const matchedTable = tablesWithStatus.find((table) => table.id === selectedTableId);

    if (!matchedTable?.dbId) {
      throw new Error('Select a valid table before placing the order.');
    }

    const finalCustomerName = customerDetails.name?.trim() || 'Guest';

    const order = await createOrderWithItemsAndPayment({
      order: {
        table_id: matchedTable.dbId,
        customer_name: finalCustomerName,
        payment_method: paymentMethod,
        status: 'pending',
      },
      items: cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        preferences: item.preferences ?? [],
      })),
    });

    if (releaseTable) {
      await updateTableStatus(matchedTable.dbId, 'available');
    }

    setLiveOrders((current) => [order, ...current]);
    setTables((current) => current.map((table) => (
      table.id === selectedTableId
        ? { ...table, status: releaseTable ? 'available' : 'occupied' }
        : table
    )));
    setLastPlacedOrder({
      ...order,
      customer: {
        name: finalCustomerName,
        phone: customerDetails.phone,
      },
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      serviceCharge: totals.serviceCharge,
      total: totals.total,
      paymentMethod,
      estimatedPrepMinutes: Math.max(12, order.items.length * 6),
      ticketGeneratedAt: new Date().toISOString(),
    });
    setCartItems([]);
    setCustomerDetailsState({ name: '', phone: '' });
    writeTableId(releaseTable ? null : selectedTableId);

    if (releaseTable) {
      setSelectedTableIdState(null);
    }

    return order;
  };

  const clearLastPlacedOrder = () => {
    setLastPlacedOrder(null);
  };

  const releaseSelectedTable = async () => {
    const matchedTable = findTable(selectedTableId);

    if (!matchedTable?.dbId) {
      writeTableId(null);
      setSelectedTableIdState(null);
      return null;
    }

    const updatedTable = await updateTableStatus(matchedTable.dbId, 'available');
    setTables((current) => current.map((table) => (table.id === updatedTable.id ? updatedTable : table)));
    writeTableId(null);
    setSelectedTableIdState(null);
    return updatedTable;
  };

  const syncKitchenTicketStatus = async (orderId, nextStatus) => {
    if (!isAuthenticated) {
      return null;
    }

    const updatedOrder = await updateOrderStatus(orderId, nextStatus);
    setLiveOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));

    if (nextStatus.toLowerCase() === 'served' && updatedOrder.tableId) {
      const updatedTable = await updateTableStatus(updatedOrder.tableId, 'available');
      setTables((current) => current.map((table) => (table.id === updatedTable.id ? updatedTable : table)));
    }

    return updatedOrder;
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
    catalogItems,
    catalogCategories,
    reservations,
    reserveTable,
    tables: tablesWithStatus,
    groundFloorTables,
    firstFloorTables,
    kitchenTickets,
    liveOrders,
    lastPlacedOrder,
    placeOrder,
    clearLastPlacedOrder,
    refreshCatalog,
    refreshTables,
    refreshOrders,
    refreshReservations,
    releaseSelectedTable,
    syncKitchenTicketStatus,
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
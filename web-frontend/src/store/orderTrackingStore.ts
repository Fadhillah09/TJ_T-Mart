import { create } from 'zustand';
import { useNotifStore } from './notifStore';

export type TrackingStatus =
  | 'WAITING_COURIER_ACCEPTANCE'
  | 'COURIER_ACCEPTED'
  | 'COURIER_TO_STORE'
  | 'SHOPPING'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CourierInfo {
  name: string;
  photo?: string | null;
  phone: string;
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  rating: number;
  lat: number;
  lng: number;
}

export interface TrackingNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface RefundStep {
  title: string;
  desc: string;
  time?: string;
  status: 'completed' | 'current' | 'pending';
}

export interface TrackingSession {
  orderId: string;
  status: TrackingStatus;
  elapsedSeconds: number;
  countdownTime: number; // starts at 600 (10 mins)
  courier: CourierInfo | null;
  refundInfo: {
    status: string;
    refundAmount: number;
    trackingSteps: RefundStep[];
  } | null;
  totalAmount: number;
}

interface OrderTrackingState {
  sessions: Record<string, TrackingSession>;
  notifications: TrackingNotification[];
  startTracking: (orderId: string, totalAmount: number) => void;
  tickSession: (orderId: string) => void;
  simulateCourierAccepted: (orderId: string) => void;
  simulateTimeout: (orderId: string) => void;
  markNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
}

const T_MART_COORDS = { lat: -6.9740, lng: 107.6303 };
const CUSTOMER_COORDS = { lat: -6.9698, lng: 107.6295 };
const COURIER_START_COORDS = { lat: -6.9755, lng: 107.6315 };

// Polyline route generator
const interpolatePoints = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, ratio: number) => {
  return {
    lat: start.lat + (end.lat - start.lat) * ratio,
    lng: start.lng + (end.lng - start.lng) * ratio,
  };
};

export const useOrderTrackingStore = create<OrderTrackingState>((set, get) => ({
  sessions: {},
  notifications: [],

  startTracking: (orderId, totalAmount) => {
    const existing = get().sessions[orderId];
    if (existing) return;

    const newSession: TrackingSession = {
      orderId,
      status: 'WAITING_COURIER_ACCEPTANCE',
      elapsedSeconds: 0,
      countdownTime: 600,
      courier: null,
      refundInfo: null,
      totalAmount,
    };

    set((state) => ({
      sessions: { ...state.sessions, [orderId]: newSession },
    }));
  },

  tickSession: (orderId) => {
    const session = get().sessions[orderId];
    if (!session || session.status === 'COMPLETED' || session.status === 'CANCELLED') return;

    const nextElapsed = session.elapsedSeconds + 1;
    let nextStatus: TrackingStatus = session.status;
    let nextCountdown = session.countdownTime;
    let nextCourier = session.courier ? { ...session.courier } : null;
    let nextRefundInfo = session.refundInfo;

    // Countdown logic
    if (session.status === 'WAITING_COURIER_ACCEPTANCE') {
      nextCountdown = Math.max(0, session.countdownTime - 1);
      if (nextCountdown === 0) {
        // Automatically timeout if 10 mins pass
        nextStatus = 'CANCELLED';
      } else if (nextElapsed >= 15) {
        // Auto courier acceptance for demo purposes after 15 seconds
        nextStatus = 'COURIER_ACCEPTED';
      }
    }

    // Status transitions and coordinates update
    if (nextStatus === 'COURIER_ACCEPTED') {
      nextStatus = 'COURIER_TO_STORE';
      nextCourier = {
        name: 'Budi Santoso',
        phone: '0812-3456-7890',
        rating: 4.8,
        lat: COURIER_START_COORDS.lat,
        lng: COURIER_START_COORDS.lng,
      };

      const notif: TrackingNotification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        orderId,
        title: 'Kurir Ditemukan 🛵',
        message: 'Budi Santoso sedang bersiap mengambil pesanan Anda.',
        timestamp: new Date(),
        read: false,
      };

      set((state) => ({
        notifications: [notif, ...state.notifications],
      }));
      useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
    } else if (nextStatus === 'COURIER_TO_STORE') {
      // Interpolate position from start to T-Mart
      // Durations: 15s to 30s (15 seconds total)
      const ratio = Math.min(1, (nextElapsed - 15) / 15);
      const pos = interpolatePoints(COURIER_START_COORDS, T_MART_COORDS, ratio);
      if (nextCourier) {
        nextCourier.lat = pos.lat;
        nextCourier.lng = pos.lng;
      }

      if (nextElapsed >= 30) {
        nextStatus = 'SHOPPING';
        const notif: TrackingNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          orderId,
          title: 'Kurir Sampai di Mart 🛒',
          message: 'Kurir mulai mencarikan barang belanjaan Anda.',
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [notif, ...state.notifications],
        }));
        useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
      }
    } else if (nextStatus === 'SHOPPING') {
      // Stay at T-Mart
      if (nextCourier) {
        nextCourier.lat = T_MART_COORDS.lat;
        nextCourier.lng = T_MART_COORDS.lng;
      }

      if (nextElapsed >= 45) {
        nextStatus = 'DELIVERING';
        const notif: TrackingNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          orderId,
          title: 'Pesanan Sedang Diantar 🚴',
          message: 'Budi Santoso telah meninggalkan mart dan sedang menuju ke lokasi Anda.',
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [notif, ...state.notifications],
        }));
        useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
      }
    } else if (nextStatus === 'DELIVERING') {
      // Interpolate from T-Mart to Customer
      // Durations: 45s to 75s (30 seconds total)
      const ratio = Math.min(1, (nextElapsed - 45) / 30);
      const pos = interpolatePoints(T_MART_COORDS, CUSTOMER_COORDS, ratio);
      if (nextCourier) {
        nextCourier.lat = pos.lat;
        nextCourier.lng = pos.lng;
      }

      // Special notification at 60s (halfway)
      if (nextElapsed === 60) {
        const notif: TrackingNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          orderId,
          title: 'Kurir Hampir Sampai! 📍',
          message: 'Kurir berjarak kurang dari 100 meter dari lokasi Anda.',
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [notif, ...state.notifications],
        }));
        useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
      }

      if (nextElapsed >= 75) {
        nextStatus = 'COMPLETED';
        const notif: TrackingNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          orderId,
          title: 'Pesanan Selesai ✅',
          message: 'Pesanan berhasil diantarkan oleh Budi Santoso.',
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [notif, ...state.notifications],
        }));
        useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
      }
    }

    if (nextStatus === 'CANCELLED') {
      nextRefundInfo = {
        status: 'Dana Sedang Dikembalikan',
        refundAmount: session.refundInfo?.refundAmount || session.totalAmount,
        trackingSteps: [
          { title: 'Pesanan Dibatalkan', desc: 'Pesanan dibatalkan karena tidak menemukan kurir', time: new Date().toLocaleTimeString('id-ID'), status: 'completed' },
          { title: 'Proses Pengembalian Dana', desc: 'Dana sedang diproses untuk ditransfer kembali', status: 'current' },
          { title: 'Refund Selesai', desc: 'Dana akan kembali ke metode pembayaran asal dalam 1-3 hari kerja', status: 'pending' },
        ],
      };
    }

    set((state) => ({
      sessions: {
        ...state.sessions,
        [orderId]: {
          ...session,
          status: nextStatus,
          elapsedSeconds: nextElapsed,
          countdownTime: nextCountdown,
          courier: nextCourier,
          refundInfo: nextRefundInfo,
        },
      },
    }));
  },

  simulateCourierAccepted: (orderId) => {
    const session = get().sessions[orderId];
    if (!session) return;

    const notif: TrackingNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      orderId,
      title: 'Kurir Ditemukan 🚶',
      message: 'Budi Santoso telah menerima pesanan Anda.',
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [notif, ...state.notifications],
      sessions: {
        ...state.sessions,
        [orderId]: {
          ...session,
          status: 'COURIER_ACCEPTED',
          elapsedSeconds: 15,
          courier: {
            name: 'Budi Santoso',
            phone: '0812-3456-7890',
            rating: 4.8,
            lat: COURIER_START_COORDS.lat,
            lng: COURIER_START_COORDS.lng,
          },
        },
      },
    }));
    useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
  },

  simulateTimeout: (orderId) => {
    const session = get().sessions[orderId];
    if (!session) return;

    const notif: TrackingNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      orderId,
      title: 'Pesanan Dibatalkan ❌',
      message: 'Pesanan dibatalkan secara otomatis karena kurir tidak ditemukan.',
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [notif, ...state.notifications],
      sessions: {
        ...state.sessions,
        [orderId]: {
          ...session,
          status: 'CANCELLED',
          refundInfo: {
            status: 'Dana Sedang Dikembalikan',
            refundAmount: 0, // Will be filled from page
            trackingSteps: [
              { title: 'Pesanan Dibatalkan', desc: 'Pesanan dibatalkan karena tidak menemukan kurir', time: new Date().toLocaleTimeString('id-ID'), status: 'completed' },
              { title: 'Proses Pengembalian Dana', desc: 'Dana sedang diproses untuk ditransfer kembali', status: 'current' },
              { title: 'Refund Selesai', desc: 'Dana akan kembali ke metode pembayaran asal dalam 1-3 hari kerja', status: 'pending' },
            ],
          },
        },
      },
    }));
    useNotifStore.getState().setUnreadCount(useNotifStore.getState().unreadCount + 1);
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    useNotifStore.getState().setUnreadCount(0);
  },

  clearNotification: (id) => {
    const notif = get().notifications.find((n) => n.id === id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    if (notif && !notif.read) {
      const currentUnread = useNotifStore.getState().unreadCount;
      useNotifStore.getState().setUnreadCount(Math.max(0, currentUnread - 1));
    }
  },
}));

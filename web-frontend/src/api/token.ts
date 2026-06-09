import axiosInstance from './axiosConfig';

export const getTokenPaket = async () => {
  const { data } = await axiosInstance.get('/token/paket');
  return data;
};

export const createSnapToken = async (payload: {
  total_amount: number;
  type: string;
  nominal: number;
}) => {
  const { data } = await axiosInstance.post('/payment/snap-token', payload);
  return data;
};

export const saveTransaksiToken = async (payload: {
  transaction_id: string;
  nominal: number;
  harga: number;
  metode: string;
  order_id: string;
}) => {
  const { data } = await axiosInstance.post('/token-listrik/beli', payload);
  return data;
};

export const getTransaksiById = async (id: string) => {
  const { data } = await axiosInstance.get(`/token/result/${id}`);
  return data;
};

export const getRiwayatToken = async () => {
  const { data } = await axiosInstance.get('/token/history');
  return data;
};
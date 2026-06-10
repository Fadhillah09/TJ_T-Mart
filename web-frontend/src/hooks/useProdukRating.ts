import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axiosConfig';

export const useProdukRating = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const [selectedStar, setSelectedStar] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [sudahRating, setSudahRating] = useState(false);

  const [komentarText, setKomentarText] = useState('');
  const [komentarSuccess, setKomentarSuccess] = useState(false);
  const [komentarError, setKomentarError] = useState('');

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['produk', Number(id)] });

  const ratingMutation = useMutation({
    mutationFn: (payload: { rating: number }) =>
      api.post(`/produk/${id}/rating`, payload),
    onSuccess: () => {
      setSudahRating(true);
      setRatingSuccess(true);
      setRatingError('');
      setTimeout(() => setRatingSuccess(false), 3000);
      invalidate();
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'Gagal menyimpan rating.';
      if (status === 422 || msg.toLowerCase().includes('sudah')) {
        setSudahRating(true);
        setRatingError('Anda sudah pernah memberikan rating untuk produk ini.');
      } else {
        setRatingError(msg);
      }
      setTimeout(() => setRatingError(''), 4000);
    },
  });

  const komentarMutation = useMutation({
    mutationFn: (payload: { komentar: string }) =>
    api.post(`/produk/${id}/rating`, payload),
    onSuccess: () => {
      setKomentarText('');
      setKomentarSuccess(true);
      setKomentarError('');
      setTimeout(() => setKomentarSuccess(false), 3000);
      invalidate();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'Gagal mengirim komentar.';
      setKomentarError(msg);
      setTimeout(() => setKomentarError(''), 4000);
    },
  });

  return {
    selectedStar, setSelectedStar,
    hoveredStar, setHoveredStar,
    ratingSuccess, ratingError, sudahRating,
    ratingMutation,
    komentarText, setKomentarText,
    komentarSuccess, komentarError,
    komentarMutation,
  };
};
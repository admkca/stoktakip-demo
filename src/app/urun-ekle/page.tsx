"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UrunEkle() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    urunAdi: "",
    kategori: "",
    stok: 0,
    fiyat: 0,
  });

  const [errors, setErrors] = useState({
    urunAdi: "",
    kategori: "",
    stok: "",
    fiyat: "",
  });

  // Kategori listesi
  const kategoriler = ["Elektronik", "Ev Eşyaları", "Kıyafet", "Gıda", "Diğer"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stok" || name === "fiyat" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors = { urunAdi: "", kategori: "", stok: "", fiyat: "" };

    // Validasyon işlemleri
    if (!formData.urunAdi) validationErrors.urunAdi = "Ürün adı gereklidir.";
    if (!formData.kategori) validationErrors.kategori = "Kategori gereklidir.";
    if (formData.stok <= 0)
      validationErrors.stok = "Stok miktarı geçerli olmalıdır.";
    if (formData.fiyat <= 0)
      validationErrors.fiyat = "Fiyat geçerli olmalıdır.";

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      return; // Formu gönderme, hata mesajlarını göster
    }

    const yeniUrun = {
      ...formData,
      tarih: new Date().toISOString(), // 🕒 Tarih ekleniyor
    };

    const mevcutUrunler = JSON.parse(localStorage.getItem("urunler") || "[]");

    // 🕒 Ürünleri yeniden → eskiye sırala
    const guncelUrunler = [yeniUrun, ...mevcutUrunler].sort(
      (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
    );

    localStorage.setItem("urunler", JSON.stringify(guncelUrunler));
    router.push("/urunler");
  };

  return (
    <div className='container mt-4'>
      <h2>Ürün Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Ürün Adı</label>
          <input
            type='text'
            name='urunAdi'
            className='form-control'
            value={formData.urunAdi}
            onChange={handleChange}
            required
          />
          {errors.urunAdi && (
            <div className='text-danger'>{errors.urunAdi}</div>
          )}
        </div>

        <div className='mb-3'>
          <label className='form-label'>Kategori</label>
          <select
            name='kategori'
            className='form-control'
            value={formData.kategori}
            onChange={handleChange}
            required
          >
            <option value=''>Kategori Seçin</option>
            {kategoriler.map((kategori, index) => (
              <option key={index} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <div className='text-danger'>{errors.kategori}</div>
          )}
        </div>

        <div className='mb-3'>
          <label className='form-label'>Stok</label>
          <input
            type='number'
            name='stok'
            className='form-control'
            value={formData.stok}
            onChange={handleChange}
            required
            min='1'
          />
          {errors.stok && <div className='text-danger'>{errors.stok}</div>}
        </div>

        <div className='mb-3'>
          <label className='form-label'>Fiyat</label>
          <input
            type='number'
            name='fiyat'
            className='form-control'
            value={formData.fiyat}
            onChange={handleChange}
            required
            min='1'
          />
          {errors.fiyat && <div className='text-danger'>{errors.fiyat}</div>}
        </div>

        <button type='submit' className='btn btn-primary'>
          Kaydet
        </button>
      </form>
    </div>
  );
}

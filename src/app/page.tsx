"use client";

import { useEffect, useState } from "react";

type Urun = {
  urunAdi: string;
  kategori: string;
  stok: number;
  fiyat: number;
  tarih: string;
};

export default function Home() {
  const [urunler, setUrunler] = useState<Urun[]>([]);

  // Ürünleri localStorage'dan al ve kategoriye göre grupla
  useEffect(() => {
    const veriler = localStorage.getItem("urunler");
    if (veriler) {
      const urunlerJSON = JSON.parse(veriler) as Urun[];
      urunlerJSON.sort(
        (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
      );
      setUrunler(urunlerJSON);
    }
  }, []);

  // Ürünleri stok güncelleme işlemi
  const updateStock = (urunAdi: string, newStock: number) => {
    const updatedUrunler = urunler.map((urun) =>
      urun.urunAdi === urunAdi ? { ...urun, stok: newStock } : urun
    );
    setUrunler(updatedUrunler);
    localStorage.setItem("urunler", JSON.stringify(updatedUrunler));

    // Stok seviyesi 5'in altına düştüyse uyarı göster
    const urun = updatedUrunler.find((urun) => urun.urunAdi === urunAdi);
    if (urun && urun.stok < 5) {
      alert(
        `Uyarı: ${urunAdi} stok seviyesi düşük! Stok miktarı: ${urun.stok}`
      );
    }
  };

  // Ürünleri silme işlemi
  const deleteProduct = (urunAdi: string) => {
    const updatedUrunler = urunler.filter((urun) => urun.urunAdi !== urunAdi);
    setUrunler(updatedUrunler);
    localStorage.setItem("urunler", JSON.stringify(updatedUrunler));
  };

  // Ürünleri kategorilere göre grupla
  const groupedByCategory = urunler.reduce((acc, urun) => {
    if (!acc[urun.kategori]) {
      acc[urun.kategori] = [];
    }
    acc[urun.kategori].push(urun);
    return acc;
  }, {} as Record<string, Urun[]>);

  // Her kategoriye özel renkler
  const categoryColors: Record<string, string> = {
    Elektronik: "primary",
    Giyim: "info",
    Gıda: "success",
    Mobilya: "warning",
    Diğer: "danger",
  };

  return (
    <div className='container mt-4'>
      <h2 className='mb-4 text-center text-primary'>Güncel Stok</h2>

      {/* Kategorilere göre grup halinde ürünleri görüntüle */}
      {Object.keys(groupedByCategory).map((kategori) => (
        <div key={kategori} className='mb-4'>
          <h3 className={`text-${categoryColors[kategori] || "secondary"}`}>
            {kategori}
          </h3>

          {/* Stok adetlerine göre sıralama ve gösterim */}
          <div className='row'>
            {groupedByCategory[kategori].map((urun, index) => (
              <div key={index} className='col-md-4 mb-4'>
                <div
                  className={`card h-100 shadow-sm border-${
                    categoryColors[kategori] || "light"
                  }`}
                >
                  <div className='card-body'>
                    <h5 className='card-title'>{urun.urunAdi}</h5>
                    <h6 className='card-subtitle mb-2 text-muted'>
                      {urun.kategori}
                    </h6>
                    <p className='card-text'>
                      <strong>Stok:</strong> {urun.stok} <br />
                      <strong>Fiyat:</strong> ₺{urun.fiyat}
                    </p>
                    <p className='text-muted' style={{ fontSize: "0.85rem" }}>
                      Eklenme:{" "}
                      {new Date(urun.tarih).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>

                    {/* Stok Azalt */}
                    <button
                      className='btn btn-outline-primary btn-sm'
                      onClick={() => updateStock(urun.urunAdi, urun.stok - 1)}
                    >
                      Stok Azalt
                    </button>

                    {/* Stok Arttır */}
                    <button
                      className='btn btn-outline-success btn-sm ms-2'
                      onClick={() => updateStock(urun.urunAdi, urun.stok + 1)}
                    >
                      Stok Arttır
                    </button>

                    {/* Ürün Sil */}
                    <button
                      className='btn btn-outline-danger btn-sm ms-2'
                      onClick={() => deleteProduct(urun.urunAdi)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

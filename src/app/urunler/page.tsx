"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Urun = {
  urunAdi: string;
  kategori: string;
  stok: number;
  fiyat: number;
  tarih: string;
};

export default function Urunler() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUrun, setCurrentUrun] = useState<Urun | null>(null);
  const [kategoriGruplari, setKategoriGruplari] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const veriler = localStorage.getItem("urunler");
    if (veriler) {
      const urunlerJSON = JSON.parse(veriler) as Urun[];
      urunlerJSON.sort(
        (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
      );

      // Kategorilere göre gruplama
      const gruplama: any = urunlerJSON.reduce((acc: any, urun: Urun) => {
        if (!acc[urun.kategori]) {
          acc[urun.kategori] = [];
        }
        acc[urun.kategori].push(urun);
        return acc;
      }, {});

      setUrunler(urunlerJSON);
      setKategoriGruplari(gruplama); // Kategorileri state'e kaydet
    }
  }, []);

  const handleEdit = (urun: Urun) => {
    setCurrentUrun(urun);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentUrun) {
      setCurrentUrun((prev) => ({
        ...prev!,
        [name]: name === "stok" || name === "fiyat" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUrun) {
      const urunler = JSON.parse(localStorage.getItem("urunler") || "[]");

      // Ürünü güncelleme işlemi
      const updatedUrunler = urunler.map((urun: Urun) =>
        urun.tarih === currentUrun.tarih ? currentUrun : urun
      );

      // localStorage'a güncellenmiş listeyi kaydetme
      localStorage.setItem("urunler", JSON.stringify(updatedUrunler));

      // Kategorileri güncelleme
      const gruplama: any = updatedUrunler.reduce((acc: any, urun: Urun) => {
        if (!acc[urun.kategori]) {
          acc[urun.kategori] = [];
        }
        acc[urun.kategori].push(urun);
        return acc;
      }, {});

      setKategoriGruplari(gruplama); // Kategorileri güncelle
      setIsModalOpen(false);
      setCurrentUrun(null);
      setUrunler(updatedUrunler); // Veriyi güncelledikten sonra UI'ı yenile
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUrun(null);
  };

  const handleDelete = (urun: Urun) => {
    const urunler = JSON.parse(localStorage.getItem("urunler") || "[]");

    // Silinen ürünü filtrele
    const updatedUrunler = urunler.filter(
      (item: Urun) => item.tarih !== urun.tarih
    );

    // Silinen ürünü localStorage'dan kaldır
    localStorage.setItem("urunler", JSON.stringify(updatedUrunler));

    // UI'de güncelleme
    setUrunler(updatedUrunler);

    // Kategorileri de güncelle
    const gruplama: any = updatedUrunler.reduce((acc: any, urun: Urun) => {
      if (!acc[urun.kategori]) {
        acc[urun.kategori] = [];
      }
      acc[urun.kategori].push(urun);
      return acc;
    }, {});

    setKategoriGruplari(gruplama);
  };

  return (
    <div className='container mt-4'>
      <h2 className='mb-4'>Ürünler</h2>

      {Object.keys(kategoriGruplari).map((kategori) => (
        <div key={kategori} className='mb-5'>
          <h3>{kategori}</h3>
          <div className='row'>
            {kategoriGruplari[kategori].map((urun: Urun, index: number) => (
              <div key={index} className='col-md-4 mb-4'>
                <div className='card h-100 shadow-sm'>
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
                    <div className='d-flex justify-content-between'>
                      <button
                        className='btn btn-outline-primary btn-sm'
                        onClick={() => handleEdit(urun)}
                      >
                        Düzenle
                      </button>
                      <button
                        className='btn btn-outline-danger btn-sm'
                        onClick={() => handleDelete(urun)} // Silme işlemi
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && currentUrun && (
        <div
          className='modal fade show'
          style={{ display: "block", paddingRight: "17px" }}
          tabIndex={-1}
          aria-labelledby='staticBackdropLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='staticBackdropLabel'>
                  Ürün Düzenle
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className='modal-body'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label className='form-label'>Ürün Adı</label>
                    <input
                      type='text'
                      name='urunAdi'
                      className='form-control'
                      value={currentUrun.urunAdi}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>Kategori</label>
                    <input
                      type='text'
                      name='kategori'
                      className='form-control'
                      value={currentUrun.kategori}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>Stok</label>
                    <input
                      type='number'
                      name='stok'
                      className='form-control'
                      value={currentUrun.stok}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>Fiyat</label>
                    <input
                      type='number'
                      name='fiyat'
                      className='form-control'
                      value={currentUrun.fiyat}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type='submit' className='btn btn-primary'>
                    Güncelle
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

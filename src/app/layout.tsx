// app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Stok Takip Sistemi",
  description: "Ürünleri yönet, stok kontrolü yap",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='tr'>
      <body>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark px-3'>
          <a className='navbar-brand' href='/'>
            Stok Takip
          </a>
          <div className='collapse navbar-collapse'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <a className='nav-link' href='/'>
                  Anasayfa
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='/urun-ekle'>
                  Ürün Ekle
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='/urunler'>
                  Ürünler
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <main className='container py-4'>{children}</main>
      </body>
    </html>
  );
}

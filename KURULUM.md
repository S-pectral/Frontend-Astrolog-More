# 🚀 Cosmic Explorer - Kurulum Talimatları

## Adım 1: Node.js Kurulumu (Eğer yoksa)

Node.js'in kurulu olup olmadığını kontrol edin:
```bash
node --version
```

Eğer kurulu değilse: https://nodejs.org adresinden indirin ve kurun.

## Adım 2: Kütüphaneleri İndir

Terminal veya CMD'yi proje klasöründe açın ve şu komutu çalıştırın:

```bash
npm install
```

Bu komut:
- Three.js ve GSAP'i indirecek
- Otomatik olarak `lib` klasörüne kopyalayacak

## Adım 3: Projeyi Çalıştır

### Windows:
```
start.bat dosyasına çift tıkla
```

### Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

### Manuel:
```
index.html dosyasını tarayıcıda aç
```

## ✅ Kontrol

Eğer her şey doğru yüklendiyse:
- `lib/three.min.js` dosyası var olmalı
- `lib/gsap.min.js` dosyası var olmalı
- `node_modules` klasörü oluşmuş olmalı

## 🐛 Sorun Giderme

### "npm: command not found" hatası:
- Node.js'i kurun: https://nodejs.org

### Kütüphaneler yüklenmediyse:
```bash
npm install
node setup-libs.js
```

### Hala çalışmıyorsa:
1. `node_modules` ve `lib` klasörlerini silin
2. `npm install` komutunu tekrar çalıştırın
3. Tarayıcı konsolunu (F12) kontrol edin

## 📝 Not

İlk kurulumda internet bağlantısı gereklidir. Kütüphaneler indikten sonra offline çalışabilir.
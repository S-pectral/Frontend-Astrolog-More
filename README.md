# 🌌 Cosmic Explorer

Interaktif bir astronomi deneyimi - Three.js ile yapılmış profesyonel bir 3D gezegen görselleştirme uygulaması.

![Cosmic Explorer](https://img.shields.io/badge/Version-1.1.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-r128-green)
![GSAP](https://img.shields.io/badge/GSAP-3.14.2-orange)

## ✨ Özellikler

- **Gelişmiş 3D Modeller**: Güneş (Özel Shader), Dünya, Mars, Jüpiter, Satürn, Ay ve Kara Delik.
- **Warp Geçiş Efekti**: Gezegenler arası geçişte sinematik "ışık hızı" (warp) animasyonu.
- **Yüksek Performans**: Optimize edilmiş geometri ve shader yapıları (60+ FPS).
- **Dinamik Atmosfer**: Parıltılı atmosfer ve bulut katmanları.
- **Canlı Arka Plan**: Titreyen yıldızlar ve rastgele geçen meteorlar.
- **Model Galerisi**: Harici 3D modelleri incelemek için özel vitrin sayfası.
- **Ses Efektleri**: Etkileşimli arayüz ve uzay ambiyans sesleri.

## 🚀 Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)

### Adımlar

1. **Depoyu klonlayın veya indirin**
```bash
git clone <repository-url>
cd cosmic-explorer
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Uygulamayı başlatın**

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

Veya doğrudan:
```bash
start index.html
```

## 📁 Proje Yapısı

```
cosmic-explorer/
├── index.html              # Ana HTML dosyası
├── models.html             # [YENİ] 3D Model Vitrini
├── package.json            # NPM bağımlılıkları
├── setup-libs.js           # Kütüphane kurulum scripti
├── start.bat               # Windows başlatma scripti
├── start.sh               # Mac/Linux başlatma scripti
│
├── js/
│   ├── main.js             # Ana uygulama mantığı
│   ├── models_app.js       # Model görüntüleyici mantığı
│   ├── config/             # Gezegen ayarları
│   ├── core/               # Sahne yönetimi (SceneManager)
│   ├── factories/          # Gezegen oluşturucular (PlanetFactory)
│   ├── systems/            # Meteor, Ses vb. sistemler
│   └── ui/                 # Arayüz yönetimi
│
├── lib/
│   ├── three.min.js       # Three.js kütüphanesi
│   └── gsap.min.js        # GSAP animasyon kütüphanesi
│
└── styles/
    ├── main.css            # Ana stiller
    ├── models.css          # Model sayfası stilleri
    ├── cursor.css         # Özel cursor stilleri
    ├── navbar.css         # Navigasyon stilleri
    └── loading.css        # Yükleme ekranı stilleri
```

## 🎮 Kullanım

### Gezegen Kontrolleri
- **Sol Tık + Sürükle**: Gezegen etrafında dönme.
- **Tekerlek**: Yakınlaşma / Uzaklaşma.
- **Butonlar**: Navigasyon menüsünü kullanarak gezegenler arası "Warp" yapın.

### Model Galerisi
- Ana menüdeki "Models" butonuna tıklayarak galeriye gidin.
- Burada harici 3D varlıkları (küp, gemi vb.) inceleyebilirsiniz.

### Gezegenler

#### 🌍 Earth (Dünya)
- Mavi gezegen - Evimiz
- Gerçekçi atmosfer ve bulut katmanı
- Mesafe: 149.6M km
- Çap: 12,742 km

#### 🔴 Mars
- Kızıl gezegen - Savaş tanrısının adını taşır
- Kırmızımsı yüzey ve ince atmosfer
- Mesafe: 227.9M km
- Çap: 6,779 km

#### 🪐 Jupiter
- Gaz devi - Güneş sisteminin en büyük gezegeni
- Renkli atmosferik bantlar
- Mesafe: 778.5M km
- Çap: 139,820 km

#### ⚫ Black Hole
- Uzay-zamanın büküldüği bölge
- Yığılma diski ile birlikte
- Ölçülemez mesafe
- Olay ufku

## 🛠️ Teknik Güncellemeler (v1.1.0)

### Görsel İyileştirmeler
- **Güneş Shader**: Güneş yüzeyi için granüllü gürültü (noise) ve kenar kararması (limb darkening) eklendi.
- **Warp Modu**: Geçişler artık sadece büyüyüp küçülme değil, derinlikten sahneye uçuş şeklinde.

### Optimizasyon
- Gezegen geometrileri 128x segmentten 64x segmente düşürülerek performans artırıldı (%75 GPU yükü azaltıldı).
- Çökme sorunları (Loading Screen ve Ses Sistemi) giderildi.

### Tarayıcı Desteği

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Özelleştirme

### Gezegen Renkleri Değiştirme

[`js/app.js`](js/app.js:20) dosyasında `planetSpecs` objesini düzenleyin:

```javascript
planetSpecs: {
    earth: {
        color: 0x2194ce,          // Gezegen rengi
        atmosphereColor: 0x64c8ff, // Atmosfer rengi
        radius: 10,                // Yarıçap
        rotationSpeed: 0.001      // Dönüş hızı
    }
}
```

### Yeni Gezegen Ekleme

1. `planetSpecs` içine yeni gezegen ekleyin
2. HTML'de yeni navigasyon butonu ekleyin
3. Gerekirse özel render fonksiyonu oluşturun

## 📝 Notlar

- Mobil cihazlarda özel cursor devre dışı bırakılır
- Tüm animasyonlar GSAP ile optimize edilmiştir
- Three.js sahne otomatik olarak temizlenir

## 🐛 Sorun Giderme

### "Three.js yüklenemedi" hatası
```bash
npm install
node setup-libs.js
```

### Sayfa boş görünüyor
- Konsolu kontrol edin (F12)
- `lib/` klasöründe dosyaların olduğundan emin olun
- Tarayıcı cache'ini temizleyin

### Animasyonlar çalışmıyor
- GSAP kütüphanesinin yüklendiğinden emin olun
- Konsol hatalarını kontrol edin

## 📄 Lisans

Bu proje eğitim amaçlıdır.

## 👨‍💻 Geliştirici

Senior Frontend Developer tarafından geliştirilmiştir.

---

**🌟 Keyifli Keşifler!**
# 🌌 Cosmic Explorer

Interaktif bir astronomi deneyimi - Three.js ile yapılmış profesyonel bir 3D gezegen görselleştirme uygulaması.

![Cosmic Explorer](https://img.shields.io/badge/Version-1.0.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-r128-green)
![GSAP](https://img.shields.io/badge/GSAP-3.14.2-orange)

## ✨ Özellikler

- **Gerçekçi 3D Gezegenler**: Earth, Mars, Jupiter ve Black Hole
- **Akıcı Animasyonlar**: GSAP ile sinematik geçişler
- **Interaktif Navigasyon**: Gezegenler arası sorunsuz geçiş
- **Özel Cursor**: Özelleştirilmiş cursor tasarımı
- **Parallax Efekti**: Mouse hareketine duyarlı kamera
- **Responsive Tasarım**: Tüm cihazlarda uyumlu
- **Yükleme Ekranı**: Profesyonel animasyonlu loading
- **Info Panel**: Her gezegen için detaylı bilgiler

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
├── package.json            # NPM bağımlılıkları
├── setup-libs.js          # Kütüphane kurulum scripti
├── start.bat              # Windows başlatma scripti
├── start.sh               # Mac/Linux başlatma scripti
│
├── js/
│   └── app.js             # Ana uygulama mantığı
│
├── lib/
│   ├── three.min.js       # Three.js kütüphanesi
│   └── gsap.min.js        # GSAP animasyon kütüphanesi
│
└── styles/
    ├── main.css           # Ana stiller
    ├── cursor.css         # Özel cursor stilleri
    ├── navbar.css         # Navigasyon stilleri
    └── loading.css        # Yükleme ekranı stilleri
```

## 🎮 Kullanım

### Gezegen Değiştirme

1. Üst navigasyon çubuğundan bir gezegen seçin
2. Gezegen otomatik olarak yüklenecek ve animasyonlu geçiş yapılacak
3. Sol alttaki info panelden gezegen bilgilerini görüntüleyin

### Mouse Kontrolleri

- **Mouse Hareketi**: Parallax kamera efekti
- **Hover**: İnteraktif elementlerde görsel geri bildirim

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

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **Three.js (r128)**: 3D grafik motoru
- **GSAP (3.14.2)**: Animasyon kütüphanesi
- **Vanilla JavaScript**: ES5+ uyumlu kod
- **CSS3**: Modern stil ve animasyonlar

### Performans Optimizasyonları

- Pixel ratio sınırlandırması (max 2x)
- Efficient geometry management
- Optimized particle systems
- Responsive resource loading

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
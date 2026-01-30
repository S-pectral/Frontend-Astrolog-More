# 🚀 Proje Geliştirme Notları & Yeni Özellikler

Bu dosya, standart proje yapısına ek olarak geliştirdiğimiz **yeni özellikleri, görsel iyileştirmeleri ve teknik eklemeleri** listeler.

## 🪐 1. Yeni Gezegenler ve Gök Cisimleri
Standart sisteme eklenen yeni 3D gök cisimleri:
- **Güneş (Sun):** Sıradan bir küre yerine, yüzeyinde hareket eden lav/plazma etkisi (Granular Noise) ve kenar kararması (Limb Darkening) içeren özel **Shader** teknolojisi ile yeniden yaratıldı.
- **Satürn (Saturn):** Halkalı yapısı ve özel dokusuyla sisteme eklendi.
- **Ay (Moon):** Dünya'nın uydusu olarak detaylı krater dokularıyla eklendi.

## 🎬 2. Sinematik Geçişler ve Kamera Hareketi
- **Warp (Işık Hızı) Efekti:** Gezegenler arası geçiş artık sadece "büyüme/küçülme" değil. Kamera uzayın derinliklerinden (Z ekseni -1000) seçilen gezegene doğru sinematik bir uçuş (Warp) gerçekleştiriyor.
- **Dinamik Kamera:** Kullanıcı etkileşimi sırasında mouse hareketine duyarlı parallax (derinlik) efekti güçlendirildi.

## 🔊 3. Ses Efektleri (Sound FX)
Tamamen yeni bir ses motoru (`SoundManager.js`) entegre edildi:
- **Navigasyon Sesleri:** Gezegen seçimi ve menü geçişlerinde fütüristik arayüz sesleri.
- **Ambiyans:** Arka planda uzay boşluğu hissi veren derin "Drone" sesleri.
- **Hover Efektleri:** Fare ile gezegen veya buton üzerine gelindiğinde ince detay sesleri.

## 📦 4. 3D Model Vitrini (Embeds)
Harici, yüksek poligonlu ve detaylı modelleri sergilemek için ayrı bir **Model Galerisi** (`models.html`) oluşturuldu:
- **Özelleştirilmiş Arayüz:** Sketchfab üzerinden çekilen modellerin üzerindeki gereksiz butonlar/yazılar (crop tekniği ile) temizlendi.
- **Eklenen Modeller:**
    1.  **Rocket Orbiting Moon:** Ay yörüngesindeki roket animasyonu.
    2.  **Apollo Command Module:** Tarihi Apollo 11 komuta modülü.
    3.  **Apollo Interior:** Uzay aracının iç detayları.

## 🎨 5. Görsel ve Atmosferik İyileştirmeler
- **Canlı Arka Plan:** Sabit yıldızlar yerine, parıldayan (twinkle) **Dinamik Yıldızlar** sistemi yazıldı.
- **Meteor Yağmuru:** Arka planda rastgele zamanlarda geçen kayan yıldızlar (Meteor System) eklendi.
- **Tam 3D Yapı:** Tüm gezegenler, ışık ve gölge hesaplamalarına sahip gerçek 3D (Three.js Mesh) objelerdir.

## ⚡ 6. Performans Optimizasyonu
- **Geometri Düzeltmesi:** Gezegenlerin poligon sayısı (segment) mobil ve web performansı için optimize edildi (128x -> 64x), görüntü kalitesi korunarak FPS artışı sağlandı.

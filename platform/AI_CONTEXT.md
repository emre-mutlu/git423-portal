# GİT 423 Platformu - Sistem Bağlamı (AI Context & Architecture)

Bu belge, bu projeye sonradan dahil olan veya kodu analiz eden herhangi bir Yapay Zeka (AI) asistanının, geliştiricinin veya sistemin "Nerede olduğunu, nasıl çalışması gerektiğini ve hangi kuralları ihlal etmemesi gerektiğini" anlaması için bir anayasa niteliğindedir.

LÜTFEN BU PROJEDE KOD YAZMADAN VEYA YENİ ÖZELLİK EKLENMEDEN ÖNCE BU KURALLARI DİKKATLE OKUYUNUZ.

## 1. Proje Özeti
Bu proje, Emre Mutlu tarafından yürütülen **GİT 423 Web Tasarımı** dersi (Görsel İletişim Tasarımı Bölümü) için hazırlanan; ders notlarının (haftalar), duyuruların ve kaynakların yönetildiği, aynı zamanda GitHub Classroom ödev teslimlerini destekleyen ve dinamik not projeksiyonu yapan bir Headless Eğitim Platformudur. İki farklı şubeye hizmet vermektedir.

## 2. Teknoloji Yığını (Tech Stack)
- **Framework:** Astro (Statik Site Oluşturucu - SSG)
- **İçerik Yönetimi:** Markdown (MD) ve Astro Content Collections v5+ (Zod Schemas + Glob Loader)
- **Stil Dili:** Vanilla CSS (Global CSS mantığıyla inşa edilmiştir, TailwindCSS KULLANILMAMAKTADIR).
- **Veritabanı:** Güvenlik ve basitlik açısından statik JavaScript modülü (`src/data/students.js`).

## 3. Tasarım Dili (Design System: Linear "Command Center")
Proje baştan aşağıya **Linear** uygulamasının "Command Center" tasarım estetiğine göre kurgulanmıştır.
> **AI Asistanı için Tasarım Kuralı:** Yeni bir bileşen (component) oluştururken bu kuralların dışına çıkılması kesinlikle YASAKTIR.

- **Renk Paleti (Koyu Tema Zorunlu):**
  - Arkaplan daima `Pitch Black` (`#08090a`).
  - Kart yüzeyleri katmanına göre `Graphite` (`#0f1011`) veya `Deep Slate` (`#161718`).
  - Birincil Aksiyon Butonları (Call to Action) SADECE `Neon Lime` (`#e4f222`). Başka hiçbir yerde canlı renk kullanılmamalıdır.
  - Border'lar `Charcoal Grey` (`#23252a`) ve `1px` kalınlığında olmalıdır.
  - Metinler `Porcelain` (`#f7f8f8`) veya ikincil/üçüncül ise `Storm Cloud` (`#8a8f98`).
- **Tipografi:** 
  - Arayüz metinlerinde `Inter` (Google Fonts).
  - Sayısal veriler, tablolar, öğrenci notları ve kod bloklarında MUTLAKA `IBM Plex Mono` (monospace).
- **Şekil ve Form:**
  - Tüm genel kapsayıcılar ve butonlar KESİN `6px` radius olmalıdır. `border-radius: 6px` kuralı çiğnenmemeli. Hap formu kullanılmaz (Pill-shaped sadece ufak tag/etiket bileşenlerinde geçerlidir).
  - Kutularda sadece teknik derinlik hissi veren küçük gölgeler (`rgba(0, 0, 0, 0.4) 0px 2px 4px 0px`) olmalıdır, devasa blur gölgeler (glow efektleri) yasaktır.

## 4. Öğrenci Not Paneli ve İş Mantığı (Business Logic)
Platform, öğrencilerin sadece ID (Öğrenci Numarası) girerek notlarını sorguladıkları bir sisteme sahiptir. 
- **100/60 Puanlama Algoritması:** Öğrencinin GitHub üzerinden teslim ettiği ödevleri "on-time" (Zamanında - 100 tam puan), "late" (Geç Teslim - 60 tavan puan) veya "not-submitted" (Teslim Edilmedi - 0) olarak `students.js` dosyasına kaydedilir. JavaScript bu statüleri anlık olarak puana çevirir.
- **Dinamik Vize Ortalaması:** Öğrencinin "şimdiyekadar değerlendirilmiş" ödevlerinin toplam puanı, değerlendirilen ödev sayısına bölünerek Vize projeksiyonu anlık olarak hesaplanır. Gelecekte eklenecek bir özellik bu matematiği bozmamalıdır.

## 5. Ders Yürütücüsü Özel Kuralları (ÖNEMLİ)
Aşağıdaki kurallar bizzat ders yürütücüsü Emre Mutlu'nun talepleridir:
- Veri ihlallerini veya görüntüleme sorunlarını önlemek için, UI üzerinde hiçbir öğrencinin tam adı gösterilmemeli, listeler maskelenmiş olmalıdır (Örn: A*** Y***).
- Ders materyalleri (weeks) şubelere göre ayrılmaz (Single Source of Truth). Ancak teslim bağlantıları (GitHub Classroom URL'leri) Şube 1 ve Şube 2 için ayrı ayrı şema (Zod) üzerinde tutulur.

## 6. Geliştirme ve Dağıtım Adımları
- Sürüm ve test işlemleri yerel ortamda `npm run dev` ile `http://localhost:4321` adresinde test edilmelidir.
- Tüm `git` logları ve majör özellikler `CHANGELOG.md` dosyasına kaydedilmelidir. Sistem güncellemelerinde geçmiş versiyonları silmeyiniz, daima ekleme (append) yapınız.

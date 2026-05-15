# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-15

### Changed — Supabase Migration (Faz 1–5)

Platform baştan aşağıya Supabase + SSR mimarisine taşındı. GitHub PR tabanlı ödev sistemi ve statik veri dosyaları kaldırıldı.

**Faz 1 — Auth Altyapısı**
- Öğrenci no + 4 haneli PIN ile giriş (`/login`)
- İlk girişte PIN belirleme akışı
- HTTP-only session cookie (`git423_session`, 24 saat)
- Astro middleware ile `/grades` ve `/submit` rotaları korundu

**Faz 2 — Not Paneli**
- `grading.astro` → `grades.astro` olarak yeniden yazıldı
- Supabase'den öğrenciye özel teslim + not verileri çekiliyor
- Vize projeksiyonu, tamamlanan ödev sayısı, ödev bazlı durum badge'leri

**Faz 3 — Ödev Teslim**
- ZIP yükleme → Supabase Storage (`submissions/{student_id}/{assignment_id}.zip`)
- `submissions` tablosuna upsert (yeniden teslim desteği)
- Sunucu taraflı `is_late` deadline hesabı
- GitHub API bağımlılığı tamamen kaldırıldı

**Faz 4 — Admin Paneli**
- `/admin/login` → `ADMIN_PASSWORD` env doğrulaması, 8 saatlik admin cookie
- Dashboard: öğrenci/ödev/teslim istatistikleri + son teslimler
- Ödev yönetimi: oluşturma, aktif/pasif toggle
- Teslim listesi: ödev ve durum filtreleri
- Teslim detayı: JSZip dosya ağacı, highlight.js kod görüntüleyici, blob URL iframe önizleme, puan girişi
- Öğrenci yönetimi: şube filtresi, PIN sıfırlama

**Faz 5 — Temizlik**
- `src/data/students.js` ve `src/data/registry.json` silindi
- Eski `grading.astro` silindi
- Header'daki `/grading` linki `/grades` olarak güncellendi
- `AI_CONTEXT.md` yeni mimariyi yansıtacak şekilde yeniden yazıldı

### Removed
- GitHub PR tabanlı ödev teslim otomasyonu
- Statik `students.js` veri dosyası
- `registry.json` öğrenci kaydı
- `/grading` rotası

---

## [1.0.0] - 2026-05-14

### Added
- Astro SSG tabanlı proje iskeleti (`git423/platform`) oluşturuldu.
- Zod schema validator entegrasyonu ile Markdown tabanlı 3 Content Collection (`weeks`, `announcements`, `resources`) oluşturuldu.
- Öğrenci numarasıyla giriş yapılan ve 100/60 kuralına göre çalışan dinamik not hesaplama paneli (`grading.astro` & `data/students.js`) geliştirildi.
- "Linear" (Command Center) tasarım dili sisteme entegre edildi:
  - Global token'lar oluşturuldu (Pitch Black, Graphite, Neon Lime vb.).
  - Tipografi Google Fonts üzerinden Inter ve IBM Plex Mono olarak ayarlandı.
  - Bileşenler (Header, Footer, Kartlar) 6px radius ve gölgesiz keskin teknik hatlarla yeniden uyarlandı.
- Yapay zeka asistanları ve gelecekteki geliştirmeler için referans rehberi olan `AI_CONTEXT.md` dosyası projeye dahil edildi.

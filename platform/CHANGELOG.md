# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

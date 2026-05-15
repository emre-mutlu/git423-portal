# GİT 423 Platformu - Sistem Bağlamı (AI Context & Architecture)

Bu belge, bu projeye sonradan dahil olan veya kodu analiz eden herhangi bir Yapay Zeka (AI) asistanının, geliştiricinin veya sistemin "Nerede olduğunu, nasıl çalışması gerektiğini ve hangi kuralları ihlal etmemesi gerektiğini" anlaması için bir anayasa niteliğindedir.

LÜTFEN BU PROJEDE KOD YAZMADAN VEYA YENİ ÖZELLİK EKLENMEDEN ÖNCE BU KURALLARI DİKKATLE OKUYUNUZ.

## 1. Proje Özeti

**GİT 423 Web Tasarımı** dersi (Görsel İletişim Tasarımı Bölümü) için hazırlanan eğitim platformudur. Ders notları, duyurular, kaynaklar; öğrenci ödev teslimi ve not görüntüleme; eğitmen için tam yönetim paneli (admin) barındırır. İki farklı şubeye hizmet vermektedir.

## 2. Teknoloji Yığını (Tech Stack)

- **Framework:** Astro (SSR — `output: "server"`)
- **Adapter:** `@astrojs/netlify` — Netlify Functions üzerinde çalışır
- **İçerik Yönetimi:** Markdown + Astro Content Collections v5 (Zod schemas)
- **Veritabanı:** Supabase PostgreSQL (`students`, `assignments`, `submissions` tabloları)
- **Dosya Depolama:** Supabase Storage (`submissions` bucket — ZIP dosyaları)
- **Auth:** HTTP-only cookie (`git423_session` öğrenci, `git423_admin` admin)
- **Stil:** Vanilla CSS (TailwindCSS KULLANILMAMAKTADIR)
- **Deploy:** Netlify (GitHub Actions → `netlify-cli deploy --prod`)

## 3. Dosya Yapısı (Kritik Yollar)

```
platform/src/
  lib/
    supabase.ts       — supabase (anon) + supabaseAdmin (service role) client'ları
    auth.ts           — PIN hashleme, session/admin cookie üretme & doğrulama
  middleware.ts       — /grades, /submit → öğrenci cookie; /admin/* → admin cookie
  layouts/
    Layout.astro      — Öğrenci sayfaları (Header + Footer içerir)
    AdminLayout.astro — Admin sayfaları (admin nav içerir)
  pages/
    login.astro           — Öğrenci girişi (no + PIN)
    grades.astro          — Öğrenci not paneli (Supabase'den)
    submit.astro          — Ödev teslim (ZIP → Supabase Storage)
    admin/
      login.astro         — Admin giriş (ADMIN_PASSWORD)
      index.astro         — Dashboard
      assignments.astro   — Ödev CRUD
      submissions.astro   — Teslim listesi + filtre
      submissions/[id].astro — Kod inceleyici + iframe önizleme + not girişi
      students.astro      — Öğrenci listesi + PIN sıfırlama
    api/
      auth/             — check-number, login, set-pin, logout
      submit-homework.ts
      admin/
        login.ts / logout.ts
        assignments.ts          — POST/PATCH/DELETE
        submissions/[id]/grade.ts — PATCH: status, score, graded_at
        students/[id]/reset-pin.ts — POST: pin_hash = null
```

## 4. Supabase Şeması

**`students`:** `id`, `student_number`, `name_masked`, `branch`, `pin_hash`
**`assignments`:** `id`, `week_number`, `title`, `deadline`, `is_active`
**`submissions`:** `id`, `student_id`, `assignment_id`, `file_path`, `submitted_at`, `is_late`, `status` (`submitted`|`graded`), `score`, `graded_at`

Storage bucket: `submissions/{student_id}/{assignment_id}.zip`

## 5. Auth Akışı

**Öğrenci:** `/login` → öğrenci no + PIN → `git423_session` cookie (base64 `studentId:token`, HttpOnly, 24 saat) → middleware `context.locals.student` set eder
**Admin:** `/admin/login` → `ADMIN_PASSWORD` env → `git423_admin=authorized` cookie (HttpOnly, 8 saat)

## 6. Tasarım Dili (Linear "Command Center")

> **AI Asistanı için Tasarım Kuralı:** Yeni bir bileşen oluştururken bu kuralların dışına çıkılması kesinlikle YASAKTIR.

- **Renk:** Arkaplan `Pitch Black` (`#08090a`). Kartlar `Graphite`/`Deep Slate`. CTA butonlar SADECE `Neon Lime` (`#e4f222`). Border `Charcoal Grey` `1px`.
- **Tipografi:** Arayüz → `Inter`. Sayılar/tablolar/kod → `IBM Plex Mono`.
- **Şekil:** `6px` radius zorunlu. Pill sadece küçük tag'lerde. Glow efekti yasak.
- **Öğrenci gizliliği:** Tam isim hiçbir yerde gösterilmez — sadece `name_masked`.

## 7. Geliştirme ve Dağıtım

- Lokal: `npm run dev` → `http://localhost:4321`
- Deploy: `master` branch'e push → GitHub Actions → Netlify otomatik deploy
- Tüm önemli değişiklikler `CHANGELOG.md`'ye eklenir (append, silme yapılmaz)

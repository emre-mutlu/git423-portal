export const studentsData = [
  {
    id: "123456789", // Öğrenci numarası
    name: "A*** Y***", // Maskelenmiş isim
    sube: "Şube 1",
    // Ödevler (1'den 8'e kadar). null olanlar henüz girilmemiş/teslim edilmemiş demektir.
    // status: "on-time" (100), "late" (60), "not-submitted" (0) veya null.
    assignments: [
      { id: 1, title: "HTML İskeleti", status: "on-time" },
      { id: 2, title: "CSS Tipografi", status: "late" },
      { id: 3, title: "Box Model & Flex", status: "not-submitted" },
      { id: 4, title: "Wireframe & Menu", status: null },
      { id: 5, title: "CSS Grid Portfolyo", status: null },
      { id: 6, title: "Responsive Galeri", status: null },
      { id: 7, title: "UI Etkileşimleri", status: null },
      { id: 8, title: "Proje Optimizasyonu", status: null },
    ],
    finalProject: null // Final proje notu 0-100 arası veya null
  },
  {
    id: "987654321",
    name: "B*** K***",
    sube: "Şube 2",
    assignments: [
      { id: 1, title: "HTML İskeleti", status: "on-time" },
      { id: 2, title: "CSS Tipografi", status: "on-time" },
      { id: 3, title: "Box Model & Flex", status: "on-time" },
      { id: 4, title: "Wireframe & Menu", status: null },
      { id: 5, title: "CSS Grid Portfolyo", status: null },
      { id: 6, title: "Responsive Galeri", status: null },
      { id: 7, title: "UI Etkileşimleri", status: null },
      { id: 8, title: "Proje Optimizasyonu", status: null },
    ],
    finalProject: null
  }
];

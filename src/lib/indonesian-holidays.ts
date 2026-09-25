export interface IndonesianHoliday {
  name: string
  isHoliday: boolean // true = Hari Libur Nasional (Tanggal Merah), false = Hari Besar Nasional
  description?: string
}

export interface MonthHolidayItem extends IndonesianHoliday {
  dateKey: string // "YYYY-MM-DD"
  day: number
}

// Tanggal merah tetap (setiap tahun sama)
const FIXED_NATIONAL_HOLIDAYS: Record<string, string> = {
  "01-01": "Tahun Baru Masehi",
  "05-01": "Hari Buruh Internasional",
  "06-01": "Hari Lahir Pancasila",
  "08-17": "Hari Kemerdekaan Republik Indonesia",
  "12-25": "Hari Raya Natal",
}

// Tanggal merah dinamis (berdasarkan kalender Hijriyah, Saka, Imlek, dan Gregorian)
const VARIABLE_NATIONAL_HOLIDAYS: Record<string, string> = {
  // 2024
  "2024-02-08": "Isra Mi'raj Nabi Muhammad SAW",
  "2024-02-10": "Tahun Baru Imlek 2575 Kongzili",
  "2024-03-11": "Hari Suci Nyepi (Tahun Baru Saka 1946)",
  "2024-03-29": "Wafat Yesus Kristus",
  "2024-03-31": "Hari Paskah",
  "2024-04-10": "Hari Raya Idul Fitri 1445 H",
  "2024-04-11": "Hari Raya Idul Fitri 1445 H",
  "2024-05-09": "Kenaikan Yesus Kristus",
  "2024-05-23": "Hari Raya Waisak 2568 BE",
  "2024-06-17": "Hari Raya Idul Adha 1445 H",
  "2024-07-07": "Tahun Baru Islam 1446 H",
  "2024-09-16": "Maulid Nabi Muhammad SAW",

  // 2025
  "2025-01-27": "Isra Mi'raj Nabi Muhammad SAW",
  "2025-01-29": "Tahun Baru Imlek 2576 Kongzili",
  "2025-03-29": "Hari Suci Nyepi (Tahun Baru Saka 1947)",
  "2025-03-31": "Hari Raya Idul Fitri 1446 H",
  "2025-04-01": "Hari Raya Idul Fitri 1446 H",
  "2025-04-18": "Wafat Yesus Kristus",
  "2025-04-20": "Hari Paskah",
  "2025-05-12": "Hari Raya Waisak 2569 BE",
  "2025-05-29": "Kenaikan Yesus Kristus",
  "2025-06-06": "Hari Raya Idul Adha 1446 H",
  "2025-06-27": "Tahun Baru Islam 1447 H",
  "2025-09-05": "Maulid Nabi Muhammad SAW",

  // 2026
  "2026-01-16": "Isra Mi'raj Nabi Muhammad SAW",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-03-19": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
  "2026-03-20": "Hari Raya Idul Fitri 1447 H",
  "2026-03-21": "Hari Raya Idul Fitri 1447 H",
  "2026-04-03": "Wafat Yesus Kristus",
  "2026-04-05": "Hari Paskah",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-27": "Hari Raya Idul Adha 1447 H",
  "2026-05-31": "Hari Raya Waisak 2570 BE",
  "2026-06-16": "Tahun Baru Islam 1448 H",
  "2026-08-25": "Maulid Nabi Muhammad SAW",

  // 2027
  "2027-01-05": "Isra Mi'raj Nabi Muhammad SAW",
  "2027-02-06": "Tahun Baru Imlek 2578 Kongzili",
  "2027-03-09": "Hari Raya Idul Fitri 1448 H",
  "2027-03-10": "Hari Raya Idul Fitri 1448 H",
  "2027-03-26": "Wafat Yesus Kristus",
  "2027-03-28": "Hari Suci Nyepi (Tahun Baru Saka 1949)",
  "2027-05-06": "Kenaikan Yesus Kristus",
  "2027-05-16": "Hari Raya Idul Adha 1448 H",
  "2027-05-20": "Hari Raya Waisak 2571 BE",
  "2027-06-06": "Tahun Baru Islam 1449 H",
  "2027-08-15": "Maulid Nabi Muhammad SAW",

  // 2028
  "2028-01-26": "Tahun Baru Imlek 2579 Kongzili",
  "2028-02-27": "Hari Raya Idul Fitri 1449 H",
  "2028-02-28": "Hari Raya Idul Fitri 1449 H",
  "2028-03-17": "Hari Suci Nyepi (Tahun Baru Saka 1950)",
  "2028-04-14": "Wafat Yesus Kristus",
  "2028-05-05": "Hari Raya Idul Adha 1449 H",
  "2028-05-09": "Hari Raya Waisak 2572 BE",
  "2028-05-25": "Kenaikan Yesus Kristus",
  "2028-05-26": "Tahun Baru Islam 1450 H",
  "2028-08-04": "Maulid Nabi Muhammad SAW",
}

// Hari Besar Nasional (Peringatan Penting, bukan libur nasional)
const FIXED_NATIONAL_OBSERVANCES: Record<string, string> = {
  "01-03": "Hari Amal Bakti Kemenag",
  "01-15": "Hari Dharma Samudera",
  "01-25": "Hari Gizi Nasional",
  "02-09": "Hari Pers Nasional (HPN)",
  "02-14": "Hari Peringatan PETA",
  "02-21": "Hari Peduli Sampah Nasional",
  "03-01": "Hari Penegakan Kedaulatan Negara",
  "03-08": "Hari Perempuan Internasional",
  "03-09": "Hari Musik Nasional",
  "03-30": "Hari Film Nasional",
  "04-06": "Hari Nelayan Nasional",
  "04-09": "Hari TNI Angkatan Udara",
  "04-21": "Hari Kartini",
  "04-22": "Hari Bumi",
  "04-28": "Hari Puisi Nasional",
  "05-02": "Hari Pendidikan Nasional (Hardiknas)",
  "05-20": "Hari Kebangkitan Nasional (Harkitnas)",
  "05-29": "Hari Lanjut Usia Nasional",
  "06-21": "Hari Krida Pertanian",
  "06-24": "Hari Bidan Nasional",
  "06-29": "Hari Keluarga Nasional (Harganas)",
  "07-01": "Hari Bhayangkara (Polri)",
  "07-05": "Hari Bank Indonesia",
  "07-12": "Hari Koperasi Indonesia",
  "07-22": "Hari Kejaksaan Republik Indonesia",
  "07-23": "Hari Anak Nasional",
  "08-10": "Hari Veteran Nasional",
  "08-14": "Hari Pramuka",
  "09-01": "Hari Polwan",
  "09-04": "Hari Pelanggan Nasional",
  "09-09": "Hari Olahraga Nasional (Haornas)",
  "09-17": "Hari Palang Merah Indonesia (PMI)",
  "09-24": "Hari Tani Nasional",
  "09-27": "Hari Pos dan Telekomunikasi",
  "09-28": "Hari Kereta Api",
  "09-30": "Peringatan Pemberontakan G30S/PKI",
  "10-01": "Hari Kesaktian Pancasila",
  "10-02": "Hari Batik Nasional",
  "10-05": "Hari TNI (Tentara Nasional Indonesia)",
  "10-24": "Hari Dokter Nasional",
  "10-28": "Hari Sumpah Pemuda",
  "11-10": "Hari Pahlawan",
  "11-12": "Hari Kesehatan Nasional & Hari Ayah",
  "11-14": "Hari Korps Marinir & Brimob",
  "11-25": "Hari Guru Nasional (PGRI)",
  "11-29": "Hari Korpri",
  "12-01": "Hari AIDS Sedunia",
  "12-04": "Hari Artileri Nasional",
  "12-09": "Hari Anti Korupsi Sedunia",
  "12-13": "Hari Nusantara",
  "12-19": "Hari Bela Negara",
  "12-22": "Hari Ibu",
}

const jakartaDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Jakarta",
})

/**
 * Mendapatkan format YYYY-MM-DD sesuai zona waktu Indonesia (Asia/Jakarta)
 */
export function getJakartaDateKey(date: Date): string {
  return jakartaDateFormatter.format(date)
}

/**
 * Mengambil informasi hari libur atau hari besar untuk sebuah tanggal
 */
export function getIndonesianHoliday(date: Date): IndonesianHoliday | null {
  const fullKey = getJakartaDateKey(date) // "YYYY-MM-DD"
  const monthDay = fullKey.slice(5) // "MM-DD"

  // 1. Cek Libur Nasional Dinamis
  if (VARIABLE_NATIONAL_HOLIDAYS[fullKey]) {
    return {
      name: VARIABLE_NATIONAL_HOLIDAYS[fullKey],
      isHoliday: true,
      description: "Libur Nasional",
    }
  }

  // 2. Cek Libur Nasional Tetap
  if (FIXED_NATIONAL_HOLIDAYS[monthDay]) {
    return {
      name: FIXED_NATIONAL_HOLIDAYS[monthDay],
      isHoliday: true,
      description: "Libur Nasional",
    }
  }

  // 3. Cek Hari Besar Nasional (bukan libur)
  if (FIXED_NATIONAL_OBSERVANCES[monthDay]) {
    return {
      name: FIXED_NATIONAL_OBSERVANCES[monthDay],
      isHoliday: false,
      description: "Hari Besar Nasional",
    }
  }

  return null
}

/**
 * Cek apakah tanggal tersebut adalah Tanggal Merah (Minggu atau Libur Nasional)
 */
export function isTanggalMerah(date: Date): boolean {
  if (date.getDay() === 0) return true // Hari Minggu selalu tanggal merah di Indonesia
  const holiday = getIndonesianHoliday(date)
  return holiday?.isHoliday === true
}

/**
 * Mendapatkan daftar semua Hari Libur Nasional & Hari Besar dalam suatu bulan
 */
export function getMonthHolidays(year: number, monthIndex: number): MonthHolidayItem[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const items: MonthHolidayItem[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const testDate = new Date(year, monthIndex, day, 12, 0, 0)
    const holiday = getIndonesianHoliday(testDate)
    if (holiday) {
      items.push({
        ...holiday,
        dateKey: getJakartaDateKey(testDate),
        day,
      })
    }
  }

  return items.sort((a, b) => a.day - b.day)
}

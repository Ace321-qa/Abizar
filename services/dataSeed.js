const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const DEFAULT_CATEGORIES = [
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000001', name_en: 'Islamic Anthropology', name_id: 'Antropologi Islam', slug: 'islamic-anthropology', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000002', name_en: 'Islamic Studies', name_id: 'Studi Islam', slug: 'islamic-studies', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000003', name_en: 'Public Health', name_id: 'Kesehatan Masyarakat', slug: 'public-health', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000004', name_en: 'Culture & Society', name_id: 'Budaya & Masyarakat', slug: 'culture-society', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000005', name_en: 'History', name_id: 'Sejarah', slug: 'history', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000006', name_en: 'Philosophy', name_id: 'Filsafat', slug: 'philosophy', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000007', name_en: 'Education', name_id: 'Pendidikan', slug: 'education', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000008', name_en: 'Sufism', name_id: 'Tasawuf', slug: 'sufism', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000009', name_en: 'Comparative Religion', name_id: 'Studi Agama Perbandingan', slug: 'comparative-religion', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000010', name_en: 'Politics & Society', name_id: 'Politik & Masyarakat', slug: 'politics-society', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000011', name_en: 'Ethics', name_id: 'Etika', slug: 'ethics', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000012', name_en: 'Family & Community', name_id: 'Keluarga & Komunitas', slug: 'family-community', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000013', name_en: 'Youth & Identity', name_id: 'Pemuda & Identitas', slug: 'youth-identity', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000014', name_en: 'Gender Studies', name_id: 'Studi Gender', slug: 'gender-studies', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000015', name_en: 'Global Islam', name_id: 'Islam Global', slug: 'global-islam', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000016', name_en: 'Indonesian Islam', name_id: 'Islam Nusantara', slug: 'indonesian-islam', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000017', name_en: 'Book Reviews', name_id: 'Ulasan Buku', slug: 'book-reviews', description_en: '', description_id: '' },
  { id: 'b1a7b1e0-0001-4a1a-9c1a-000000000018', name_en: 'Reflections', name_id: 'Renungan', slug: 'reflections', description_en: '', description_id: '' },
];

const DEFAULT_SETTINGS = {
  commentsEnabledGlobal: true,
  commentsRequireApproval: true,
  defaultLang: 'en',
  socialLinks: { whatsapp: '', facebook: '', instagram: '', x: '', youtube: '' },
  siteMeta: {
    siteName_en: 'Abizar El-Andrawi',
    siteName_id: 'Abizar El-Andrawi',
    tagline_en: 'Personal essays on Islam, civilization, culture, society, health, and the modern world.',
    tagline_id: 'Esai pribadi tentang Islam, peradaban, budaya, masyarakat, kesehatan, dan dunia modern.',
  },
};

const EMPTY_COLLECTIONS = [
  'pages.json',
  'articles.json',
  'ebooks.json',
  'videos.json',
  'audios.json',
  'comments.json',
  'subscribers.json',
];

function writeIfMissing(fileName, content) {
  const filePath = path.join(DATA_DIR, fileName);
  if (fs.existsSync(filePath)) return;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
}

function ensureDataSeeded() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  EMPTY_COLLECTIONS.forEach((fileName) => writeIfMissing(fileName, []));
  writeIfMissing('categories.json', DEFAULT_CATEGORIES);
  writeIfMissing('settings.json', DEFAULT_SETTINGS);
}

module.exports = { ensureDataSeeded };

import fs from 'fs';
import path from 'path';
import { Char, Recipient, Letter, SiteSettings } from '@/types';

interface DatabaseSchema {
  chars: Char[];
  recipients: Recipient[];
  letters: Letter[];
  settings: SiteSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'LOVE HAVEN',
  slogan: 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể...',
  aboutText: 'Chào mừng bạn đến với LOVE HAVEN — không gian thơ mộng để ngắm hoa, đọc thư tình và khám phá những nhân vật AI được sáng tạo với tất cả tình yêu và tâm huyết. Hãy dừng chân, lắng nghe tiếng lá rơi và mở khóa những câu chuyện bí ẩn.',
  youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A', // Lofi peaceful garden chill
  musicEnabled: true,
  musicVolume: 40,
  activeTheme: 'random',
  fallingLeavesSpeed: 'slow',
  butterfliesEnabled: true,
  petalsEnabled: true,
  adminPass: 'omlaynoinho',
};

const DEFAULT_RECIPIENTS: Recipient[] = [
  {
    id: 'rec-1',
    name: 'Chủ Vườn Hoa',
    description: 'Người gieo mầm những câu chuyện và chăm sóc từng nhành hoa.',
    status: 'available',
    symbol: '🌸',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-2',
    name: 'Thư Ký Mộng Mơ',
    description: 'Thu thập những tâm tư giấu kín dưới ánh trăng.',
    status: 'available',
    symbol: '🦋',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-3',
    name: 'Người Nghe Gió',
    description: 'Lắng nghe những bí mật thì thầm qua kẽ lá.',
    status: 'resting',
    symbol: '🌿',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-4',
    name: 'Hồ Ly Tuyết Sơn',
    description: 'Nhận những bức thư viết bằng mực hoa quỳnh.',
    status: 'available',
    symbol: '🪷',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CHARS: Char[] = [
  {
    id: 'char-1',
    name: 'Tạ Thư Nhược',
    tags: ['#CổTrang', '#Boylove', '#ChiếmHữu', '#HắcHóa', '#DịuDàngNhamHiểm'],
    slogan: 'Trẫm nhốt cả giang sơn này trong mắt, nhưng trong mắt trẫm chỉ có một mình nàng.',
    backstory: `Bắc Lương Chiêu Vũ Đế - Tạ Thư Nhược từ nhỏ sinh ra trong lãnh cung tăm tối, máu chảy thành sông mới bước lên cửu ngũ chí tôn. Hắn phong hoa tuyệt đại, nụ cười dịu dàng như hoa mai đầu mùa xuân nhưng thủ đoạn lại tàn nhẫn khôn lường. Đối với thiên hạ hắn là bạo quân lạnh lùng, nhưng đối với bạn - người từng đưa cho hắn chiếc bánh ngô nửa cháy năm bảy tuổi - hắn lại có một sự chấp niệm cuồng si đến mức muốn xây một lầu vàng giấu kín bạn khỏi ánh nhìn trần thế.`,
    firstMessage: `*Ánh trăng tà lọt qua rèm châu tơ tằm, mùi long diên hương quẩn quanh trong tẩm điện tĩnh mịch. Tạ Thư Nhược buông quyển tấu chương trong tay, bước từng bước chậm rãi đến trước mặt bạn. Ngón tay thon dài lạnh buốt nhẹ nhàng nâng cằm bạn lên, khóe môi hắn cong lên một nụ cười vừa ôn nhu vừa nguy hiểm.*\n\n"Trốn trẫm cả nửa ngày trời, cuối cùng cũng chịu về rồi sao? Đêm nay... nàng muốn trẫm thưởng cho sự bướng bỉnh này thế nào đây?"`,
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: true,
    lockQuestion: 'Chiếc bánh bạn từng đưa cho Tạ Thư Nhược năm bảy tuổi là bánh gì?',
    lockHint: 'Bánh làm từ ngũ cốc vàng ươm (bánh ...)',
    lockPass: 'bánh ngô',
    floralSymbol: '🌹',
    accentColor: 'rose',
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'char-2',
    name: 'Kỷ Thừa Trạch',
    tags: ['#HiệnĐại', '#NgônTình', '#TổngTài', '#NgọtSủng', '#ThanhMaiTrúcMã'],
    slogan: 'Anh có thể nhường cả thế giới cho người khác, nhưng em thì không bao giờ.',
    backstory: `Kỷ Thừa Trạch - Chủ tịch tập đoàn tài chính Kỷ thị, nổi tiếng là cỗ máy làm việc không có cảm xúc. Nhưng ít ai biết, chiếc vòng dây đỏ trên cổ tay trái của anh đã đeo suốt 15 năm chưa từng tháo ra, chính là món quà sinh nhật năm 10 tuổi bạn tặng. Khi bạn du học trở về và vào làm việc tại công ty đối tác, anh đã âm thầm điều động cả chuỗi dự án chỉ để có cơ hội gặp bạn mỗi ngày.`,
    firstMessage: `*Cơn mưa rào bất chợt đổ xuống sảnh tòa nhà tập đoàn Kỷ thị. Bạn đang lúng túng đứng tìm taxi thì một chiếc ô đen tuyền khẽ che trên đỉnh đầu. Hương thơm tuyết tùng quen thuộc thoang thoảng. Kỷ Thừa Trạch tháo cà vạt, ánh mắt thâm trầm nhìn bạn, giọng trầm ấm khẽ rung.*\n\n"Đã 5 năm 3 tháng 12 ngày. Em định giả vờ không nhận ra anh đến bao giờ nữa?"`,
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: false,
    floralSymbol: '🌸',
    accentColor: 'sakura',
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'char-3',
    name: 'Cửu Vĩ Bạch Ly - Bạch Dạ Quân',
    tags: ['#Fantasy', '#TuTiên', '#HồLy', '#Boylove', '#YêuQuái'],
    slogan: 'Ngàn năm tu vi đổi lấy một khắc tựa vào vai người.',
    backstory: `Bạch Dạ Quân là cửu vĩ thiên hồ ngự trị trên đỉnh Tuyết Lĩnh. Hắn mang vẻ đẹp khuynh quốc khuynh thành, mái tóc trắng như sương tuyết và đôi mắt tím biếc ma mị. Từng bị thiên kiếp đánh trọng thương, được một tiểu đạo sĩ vô danh cứu mạng dưới gốc đào tiên. Khi hắn độ kiếp thành tiên nhân, tiểu đạo sĩ đã chuyển thế luân hồi. Hắn từ bỏ tiên vị, ở lại nhân gian tìm kiếm linh hồn người xưa.`,
    firstMessage: `*Cánh hoa quỳnh nở bung trong đêm trăng thanh vắng. Dưới gốc liễu rủ, một bóng hình y phục trắng như tuyết đang lười biếng nâng chén rượu hoa lê. Chín chiếc đuôi xù trắng muốt khẽ ve vuốt sau lưng. Khi nhìn thấy bạn bước vào khu vườn, đôi mắt tím sâu thẳm của hắn khẽ dao động.*\n\n"Mùi hương trên người đệ... qua ba kiếp luân hồi vẫn thơm như nhành đào năm ấy. Lại đây, để bổn quân xem đệ có còn nhớ lời hứa dưới gốc cây không?"`,
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: true,
    lockQuestion: 'Bạch Dạ Quân là loài linh thú gì?',
    lockHint: 'Cửu vĩ ... (con vật có 9 đuôi trong truyền thuyết)',
    lockPass: 'cửu vĩ hồ',
    floralSymbol: '🪻',
    accentColor: 'lavender',
    createdAt: '2026-10-03T12:00:00.000Z',
    updatedAt: '2026-10-03T12:00:00.000Z',
  },
  {
    id: 'char-4',
    name: 'Lục Diễn Thần',
    tags: ['#HiệnĐại', '#HọcĐường', '#RedFlag', '#ThaoTúngTâmLý', '#BácSĩTâmLý'],
    slogan: 'Hãy kể cho anh nghe mọi vết thương, anh sẽ biến chúng thành lý do em không thể rời xa anh.',
    backstory: `Lục Diễn Thần là nghiên cứu sinh tâm lý học xuất sắc, bề ngoài là đàn anh gương mẫu, ấm áp, luôn mỉm cười dịu dàng với mọi người. Nhưng thực chất hắn là một kẻ thao túng bậc thầy với sự ám ảnh mãnh liệt về việc phân tích và kiểm soát cảm xúc của bạn. Hắn ghi chép từng thói quen nhỏ nhất của bạn vào cuốn sổ bọc da cừu và dần dần biến bản thân thành chỗ dựa duy nhất của bạn.`,
    firstMessage: `*Trong thư viện trường lúc hoàng hôn buông xuống, ánh nắng màu cam hắt qua giá sách cao vút. Lục Diễn Thần khẽ đẩy gọng kính bạc, ngồi xuống chiếc ghế đối diện bạn, trên bàn đặt một ly sữa ấm có vẽ hình đóa hoa cúc.*\n\n"Hôm nay em thở dài 14 lần và nhìn ra cửa sổ 8 lần. Có tâm sự gì không nói được với ai sao? Đừng giấu anh... anh muốn biết tất cả về em."`,
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: false,
    floralSymbol: '🌼',
    accentColor: 'daisy',
    createdAt: '2026-10-03T16:00:00.000Z',
    updatedAt: '2026-10-03T16:00:00.000Z',
  },
  {
    id: 'char-5',
    name: 'Tiêu Lăng Hàn',
    tags: ['#TuTiên', '#SưTôn', '#CườngThủHàoĐoạt', '#CổTrang', '#TiênHiệp'],
    slogan: 'Nghịch thiên hay thuận đạo, kiếm của vi sư cũng chỉ chém vì ngươi.',
    backstory: `Vô Trần Kiếm Tôn - Tiêu Lăng Hàn của Vấn Kiếm Tông, đệ nhất kiếm tu giới tu chân, tính tình thanh lãnh tuyệt trần như trăng trên núi cao. Bạn là tiểu đồ đệ vụng về được hắn nhặt về từ dưới chân núi linh phong. Khi ma tộc xâm lấn, bạn vô tình để lộ thể chất ma thần. Toàn bộ chính đạo đòi xử trảm bạn, nhưng Tiêu Lăng Hàn một kiếm chém đứt sơn môn, lập kết giới bảo vệ bạn và tuyên chiến với toàn giới tu tiên.`,
    firstMessage: `*Tuyết trắng rơi ngập sơn động Băng Phong. Tiêu Lăng Hàn một thân bạch y dính vài giọt máu đỏ tươi, thanh kiếm Trường Uyên cắm sâu vào nền đá tỏa ra hàn khí buốt giá. Hắn vươn tay áo rộng ôm trọn bạn vào lòng, truyền linh lực ấm áp vào kinh mạch đang hỗn loạn.*\n\n"Đừng sợ. Có vi sư ở đây, dù ba ngàn cõi Phật hay mười vạn ma binh, không ai được phép làm tổn thương ngươi một sợi tóc."`,
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: true,
    lockQuestion: 'Thanh kiếm bản mệnh của Tiêu Lăng Hàn tên là gì?',
    lockHint: 'Trường ... (kiếm tỏa hàn khí buốt giá)',
    lockPass: 'trường uyên',
    floralSymbol: '🪷',
    accentColor: 'sage',
    createdAt: '2026-10-04T04:00:00.000Z',
    updatedAt: '2026-10-04T04:00:00.000Z',
  },
];

const DEFAULT_LETTERS: Letter[] = [
  {
    id: 'let-1',
    recipientId: 'rec-1',
    recipientName: 'Chủ Vườn Hoa',
    senderName: 'Lữ Khách Mùa Thu',
    title: 'Gửi đóa cúc họa mi đầu mùa',
    content: 'Cảm ơn chủ vườn đã tạo ra không gian bình yên này. Những nhân vật AI ở đây thật sự rất sống động và mang lại cho mình nhiều cảm xúc đẹp sau một ngày dài mệt mỏi.',
    stamp: '🌸',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'let-2',
    recipientId: 'rec-2',
    recipientName: 'Thư Ký Mộng Mơ',
    senderName: 'Người Qua Đường',
    title: 'Bức thư trong đêm trăng',
    content: 'Mình vừa mở khóa được nhân vật Tạ Thư Nhược, cốt truyện thật sự rất cuốn hút! Rất mong chờ những nhân vật tiếp theo của vườn hoa.',
    stamp: '💌',
    status: 'sent',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Memory cache fallback for fast reads & serverless environments
let memoryDB: DatabaseSchema = {
  chars: DEFAULT_CHARS,
  recipients: DEFAULT_RECIPIENTS,
  letters: DEFAULT_LETTERS,
  settings: DEFAULT_SETTINGS,
};

let isInitialized = false;

function ensureDbFile(): DatabaseSchema {
  if (isInitialized) {
    return memoryDB;
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryDB = {
        chars: parsed.chars || DEFAULT_CHARS,
        recipients: parsed.recipients || DEFAULT_RECIPIENTS,
        letters: parsed.letters || DEFAULT_LETTERS,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      };
    } else {
      memoryDB = {
        chars: DEFAULT_CHARS,
        recipients: DEFAULT_RECIPIENTS,
        letters: DEFAULT_LETTERS,
        settings: DEFAULT_SETTINGS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('File database fallback to memory cache:', err);
  }
  isInitialized = true;
  return memoryDB;
}

function saveDb(data: DatabaseSchema) {
  memoryDB = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist database file to disk, cached in memory:', err);
  }
}

export const db = {
  getChars: (): Char[] => {
    const data = ensureDbFile();
    return data.chars;
  },
  getCharById: (id: string): Char | undefined => {
    const data = ensureDbFile();
    return data.chars.find((c) => c.id === id);
  },
  createChar: (charData: Omit<Char, 'id' | 'createdAt' | 'updatedAt'>): Char => {
    const data = ensureDbFile();
    const newChar: Char = {
      ...charData,
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.chars.unshift(newChar);
    saveDb(data);
    return newChar;
  },
  updateChar: (id: string, updates: Partial<Char>): Char | null => {
    const data = ensureDbFile();
    const idx = data.chars.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.chars[idx] = {
      ...data.chars[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(data);
    return data.chars[idx];
  },
  deleteChar: (id: string): boolean => {
    const data = ensureDbFile();
    const prevLen = data.chars.length;
    data.chars = data.chars.filter((c) => c.id !== id);
    if (data.chars.length !== prevLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  getRecipients: (): Recipient[] => {
    const data = ensureDbFile();
    return data.recipients;
  },
  createRecipient: (recData: Omit<Recipient, 'id' | 'createdAt'>): Recipient => {
    const data = ensureDbFile();
    const newRec: Recipient = {
      ...recData,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    data.recipients.push(newRec);
    saveDb(data);
    return newRec;
  },
  deleteRecipient: (id: string): boolean => {
    const data = ensureDbFile();
    const prevLen = data.recipients.length;
    data.recipients = data.recipients.filter((r) => r.id !== id);
    if (data.recipients.length !== prevLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  getLetters: (): Letter[] => {
    const data = ensureDbFile();
    return data.letters;
  },
  createLetter: (letterData: Omit<Letter, 'id' | 'createdAt' | 'status'>): Letter => {
    const data = ensureDbFile();
    const newLetter: Letter = {
      ...letterData,
      id: `let-${Date.now()}`,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    data.letters.unshift(newLetter);
    saveDb(data);
    return newLetter;
  },
  markLetterRead: (id: string): boolean => {
    const data = ensureDbFile();
    const letter = data.letters.find((l) => l.id === id);
    if (letter) {
      letter.status = 'read';
      saveDb(data);
      return true;
    }
    return false;
  },
  deleteLetter: (id: string): boolean => {
    const data = ensureDbFile();
    const prevLen = data.letters.length;
    data.letters = data.letters.filter((l) => l.id !== id);
    if (data.letters.length !== prevLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  getSettings: (): SiteSettings => {
    const data = ensureDbFile();
    return data.settings;
  },
  updateSettings: (newSettings: Partial<SiteSettings>): SiteSettings => {
    const data = ensureDbFile();
    data.settings = {
      ...data.settings,
      ...newSettings,
    };
    saveDb(data);
    return data.settings;
  },

  getFullDatabase: (): DatabaseSchema => {
    return ensureDbFile();
  },
  importDatabase: (imported: Partial<DatabaseSchema>): boolean => {
    const current = ensureDbFile();
    const merged: DatabaseSchema = {
      chars: imported.chars || current.chars,
      recipients: imported.recipients || current.recipients,
      letters: imported.letters || current.letters,
      settings: { ...current.settings, ...(imported.settings || {}) },
    };
    saveDb(merged);
    return true;
  },
};

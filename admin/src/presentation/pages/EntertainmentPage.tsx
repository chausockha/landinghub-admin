import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Gamepad2,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Info,
  Volume2,
  Hand,
  Palette,
  SunMoon,
  Waves,
  Wind,
  CloudRain,
  Fish,
  TreePine,
  Music,
  Scissors,
  LampDesk,
  Swords,
  Zap,
  Cpu,
  Flame,
  Play,
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header.tsx';

type GameCategory = 'action' | 'zen' | 'lofi' | 'pet';

interface GameItem {
  id: 'poly-survivor' | 'bonsai-3d' | 'zen-koi' | 'meow-3d';
  emoji: string;
  name: string;
  shortName: string;
  category: GameCategory;
  categoryLabel: string;
  engineBadge: string;
  isNew?: boolean;
  thumbnailUrl: string;
  url: string;
  description: string;
  tags: readonly string[];
  tips: ReadonlyArray<{
    icon: typeof Hand;
    title: string;
    desc: string;
  }>;
}

const CATEGORY_FILTERS: ReadonlyArray<{ id: 'all' | GameCategory; label: string }> = [
  { id: 'all', label: 'Tất cả game' },
  { id: 'action', label: 'Hành động & Sinh tồn' },
  { id: 'lofi', label: 'Cây cảnh & Lo-fi' },
  { id: 'zen', label: 'Thiền & Thư giãn' },
  { id: 'pet', label: 'Nuôi thú ảo 3D' },
];

const GAMES: readonly GameItem[] = [
  {
    id: 'poly-survivor',
    emoji: '⚔️',
    name: 'Poly Survivor 3D — Tử Chiến Sinh Tồn',
    shortName: 'Poly Survivor 3D',
    category: 'action',
    categoryLabel: 'Hành động & Sinh tồn',
    engineBadge: 'InstancedMesh · 60Hz Grid',
    isNew: true,
    thumbnailUrl: '/thumbnails/game-poly-survivor.svg',
    url: '/games/poly-survivor-3d.html',
    description:
      'Sinh tồn góc nhìn từ trên xuống giữa hàng nghìn quái vật Low-Poly tràn tới từ mọi hướng! Vũ khí tự động (Đạn đa tia, Vòng lửa, Sấm sét zigzag), hút ngọc chọn 3 thẻ nâng cấp và chạm trán Đại Boss mỗi 2 phút chỉ với ~14 Draw Calls.',
    tags: ['bullet-heaven', 'instanced-mesh', 'spatial-grid', 'roguelite'],
    tips: [
      {
        icon: Swords,
        title: 'Điều khiển WASD / Mũi tên & Joystick ảo',
        desc: 'Di chuyển khéo léo né vòng vây quái trên đấu trường rộng (hỗ trợ cả bàn phím và cảm ứng trên điện thoại); mọi vũ khí đều tự động khai hỏa.',
      },
      {
        icon: Flame,
        title: '3 Vũ khí tự động & Thẻ nâng cấp ngẫu nhiên',
        desc: 'Thu thập ngọc EXP xanh để lên cấp và chọn 1 trong 3 thẻ nâng cấp (nhấn phím 1, 2, 3 nhanh): thêm tia đạn, mở rộng vòng lửa, gọi sấm sét hoặc tăng tầm hút ngọc.',
      },
      {
        icon: Zap,
        title: '4 Chủng loại quái & Đại Boss mỗi 2 phút',
        desc: 'Mật độ và máu quái tăng dần theo phút (Quái thường, Quái nhanh, Quái trâu, Tinh anh) cùng Đại Boss khổng lồ xuất hiện ở mốc 02:00, 04:00...',
      },
      {
        icon: Cpu,
        title: 'Tối ưu InstancedMesh + Spatial Grid O(N)',
        desc: 'Góc phải trên hiển thị trực tiếp FPS, Số quái, Số đạn và số Draw Calls (renderer.info.render.calls) chứng minh hiệu năng 60 FPS mượt mà.',
      },
    ],
  },
  {
    id: 'bonsai-3d',
    emoji: '🪴',
    name: 'Pocket Bonsai & Terrarium 3D — Góc Cây Cảnh Lo-fi',
    shortName: 'Bonsai Terrarium 3D',
    category: 'lofi',
    categoryLabel: 'Cây cảnh & Lo-fi',
    engineBadge: 'Three.js · Lo-fi Synth',
    isNew: true,
    thumbnailUrl: '/thumbnails/game-bonsai-3d.svg',
    url: '/games/bonsai-terrarium-3d.html',
    description:
      'Chăm sóc chậu Bonsai 3D trong vòm kính Terrarium: tưới phun sương, tỉa cành vượt tán, bật đèn sưởi ấm và ngắm mưa rơi ngoài cửa sổ kèm nhạc Lo-fi Chillhop êm dịu để treo máy khi làm việc.',
    tags: ['bonsai-3d', 'terrarium', 'lofi-beats', 'window-rain'],
    tips: [
      {
        icon: Music,
        title: 'Nhạc Lo-fi Chillhop & Tiếng mưa cửa sổ',
        desc: 'Bấm "Bật Lo-fi Chill" ở góc trên phải và bật "Mưa Cửa Sổ" để vừa làm việc vừa nghe hợp âm Rhodes êm ái kết hợp tiếng mưa rơi.',
      },
      {
        icon: Scissors,
        title: 'Tưới phun sương & Tỉa chồi vượt tán',
        desc: 'Theo thời gian cây sẽ mọc thêm các chồi non vượt tán — bấm "Tỉa Cành" và "Tưới Phun Sương" để giữ thế Bonsai thanh thoát.',
      },
      {
        icon: LampDesk,
        title: 'Đèn sưởi quang hợp & Vòm kính Terrarium',
        desc: 'Bật/tắt đèn bàn bằng đồng chiếu sáng ấm áp xuống thảm rêu và đậy Vòm kính Terrarium để giữ độ ẩm lâu hơn.',
      },
      {
        icon: TreePine,
        title: '3 Dòng cây quý & 3 Khung cảnh bầu trời',
        desc: 'Đổi giữa Anh Đào Sakura, Tùng La Hán, Phong Đỏ Kyoto và chuyển cảnh Đêm Lo-fi / Nắng Sớm / Hoàng Hôn.',
      },
    ],
  },
  {
    id: 'zen-koi',
    emoji: '🎏',
    name: 'Zen Koi Pond 3D — Hồ Cá Koi Thiền',
    shortName: 'Hồ Cá Koi 3D',
    category: 'zen',
    categoryLabel: 'Thiền & Thư giãn',
    engineBadge: 'Three.js · WebAudio',
    isNew: true,
    thumbnailUrl: '/thumbnails/game-zen-koi.svg',
    url: '/games/zen-koi-3d.html',
    description:
      'Mặt nước gợn sóng 3D chân thực khi chạm chuột, rải thức ăn nhìn đàn cá Koi 5 sắc màu bơi lội tụ lại, thả đèn Hoa Đăng kèm tiếng nước suối tre & chuông gió ngũ cung.',
    tags: ['koi-pond', '3d-water', 'chuong-gio', 'relax'],
    tips: [
      {
        icon: Waves,
        title: 'Gợn sóng mặt nước 3D & Rải mồi',
        desc: 'Chạm hoặc lướt chuột trên mặt hồ để thả cám gọi đàn cá Koi bơi lại đớp mồi, hoặc chuyển sang "Chạm Nước" để khuấy sóng 3D.',
      },
      {
        icon: Wind,
        title: 'Suối tre Kakehi & Chuông gió Furin',
        desc: 'Chạm lần đầu vào hồ để bật tiếng suối chảy róc rách nền; bấm "Chuông Gió" để ngân vang giai điệu ngũ cung Nhật Bản.',
      },
      {
        icon: Fish,
        title: '5 Giống Cá Koi Quý & Đèn Hoa Đăng',
        desc: 'Mở mục "Thêm Koi" để thả thêm Kohaku, Hoàng Kim, Tam Thể, Xanh Ngọc, Bạch Kim (tối đa 16 chú) và thả đèn Hoa Đăng trên mặt nước.',
      },
      {
        icon: CloudRain,
        title: 'Mưa Thiền & 3 Khung Giờ Ánh Sáng',
        desc: 'Bật "Mưa Thiền" để ngắm trăm vòng sóng mưa lăn tăn, đổi Nắng Sớm / Hoàng Hôn / Đêm Đom Đóm và giữ chuột phải để xoay góc 3D.',
      },
    ],
  },
  {
    id: 'meow-3d',
    emoji: '🐱',
    name: 'Meow 3D — Thế Giới Nuôi Mèo Cưng',
    shortName: 'Meow 3D',
    category: 'pet',
    categoryLabel: 'Nuôi thú ảo 3D',
    engineBadge: 'Three.js · Pet RPG',
    isNew: true,
    thumbnailUrl: '/thumbnails/game-meow-3d.svg',
    url: '/games/meow-3d.html',
    description:
      'Thế giới nuôi mèo 3D có chiều sâu cày cuốc: kiếm Xu Cá Vàng sắm Cat Tree, Bể Cá, Robot hút bụi cho mèo cưỡi; dọn khay cát, trị búi lông, dạy lộn nhào 3D, săn chuột 30s, đón Mèo Bạn và chụp ảnh Polaroid tự lưu!',
    tags: ['pet-sim', 'cat-tree', 'polaroid', 'cozy-rpg'],
    tips: [
      {
        icon: Sparkles,
        title: 'Xu Cá Vàng & Nội thất tương tác',
        desc: 'Nhặt Xu Cá Vàng mèo thả trên sàn (hoặc khi đạt mốc cân nặng) để mua Cá hồi, Súp Churu, Cat Tree 3 tầng, Bể cá cảnh và Robot hút bụi cho mèo ngồi cưỡi!',
      },
      {
        icon: Hand,
        title: 'Khay cát, Vóc dáng mũm mĩm & Búi lông',
        desc: 'Sau khi ăn no mèo sẽ ra khay bới cát — hãy xúc dọn kịp thời trước khi bốc mùi! Nếu mèo ăn nhiều Churu bị béo hoặc khạc búi lông, hãy cho ăn Cỏ Mèo & vận động.',
      },
      {
        icon: Palette,
        title: 'Dạy Kỹ năng 3D & Săn Chuột 30s',
        desc: 'Huấn luyện Ngồi ngoan, Bắt tay, Đứng xin ăn, Lộn nhào 360° và chơi Mini-game 30s Bắt Chuột dây cót (hoặc Đom đóm ban đêm) để cày Xu.',
      },
      {
        icon: SunMoon,
        title: 'Đón Mèo Bạn thứ 2 & Chụp Polaroid',
        desc: 'Nhận nuôi thêm bé Mèo Bạn để hai đứa tự rượt đuổi, liếm lông thả tim & ngủ cuộn chung ổ. Mọi tiến trình tự lưu vào trình duyệt kèm nút chụp ảnh Polaroid tải về máy!',
      },
    ],
  },
];

export function EntertainmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stageRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | GameCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [iframeKey, setIframeKey] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const paramGame = searchParams.get('game');
  const activeGame = useMemo(
    () => GAMES.find(g => g.id === paramGame) ?? null,
    [paramGame],
  );

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GAMES.filter(g => {
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const openGame = (id: GameItem['id']) => {
    setSearchParams({ game: id });
    setIframeKey(k => k + 1);
  };

  const backToCatalog = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setTheaterMode(false);
    setShowGuide(false);
    setSearchParams({});
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (!theaterMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        setTheaterMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [theaterMode]);

  const toggleExpand = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      setTheaterMode(false);
      return;
    }

    if (theaterMode) {
      setTheaterMode(false);
      return;
    }

    if (stageRef.current?.requestFullscreen) {
      try {
        await stageRef.current.requestFullscreen();
        return;
      } catch {
        // Fallback to CSS theater mode if native fullscreen is blocked
      }
    }
    setTheaterMode(true);
  };

  const expanded = theaterMode || isFullscreen;

  /* ══════════════════════════════════════════════════════════════════════════
     MODE 1: GAME PLAYER VIEW (When user clicks a game card -> ?game=<id>)
     ══════════════════════════════════════════════════════════════════════════ */
  if (activeGame) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <Header
          title={activeGame.name}
          subtitle={activeGame.description}
        />

        <div className="flex flex-1 flex-col min-h-0 p-4 lg:p-5 gap-3.5">
          {/* Player Control Bar */}
          <div className="glass rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <button
                type="button"
                onClick={backToCatalog}
                className="btn-ghost btn-sm"
                title="Quay lại danh sách Card Game"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Danh sách Game</span>
              </button>

              <div className="h-5 w-px bg-line hidden sm:block" />

              <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                <span className="text-lg leading-none">{activeGame.emoji}</span>
                <span>{activeGame.shortName}</span>
              </span>

              <span className="chip-brand text-[11px] py-0.5 px-2.5 hidden md:inline-flex">
                {activeGame.engineBadge}
              </span>

              <span className="hidden xl:inline-flex items-center gap-1 text-xs text-ink-muted">
                <Volume2 className="h-3.5 w-3.5 text-brand" />
                Chạm vào khung 3D để bật âm thanh
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowGuide(v => !v)}
                className={`btn-ghost btn-sm ${showGuide ? 'border-brand/50 text-brand' : ''}`}
                title="Xem hướng dẫn tương tác"
              >
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Hướng dẫn</span>
              </button>

              <button
                type="button"
                onClick={() => setIframeKey(k => k + 1)}
                className="btn-ghost btn-sm"
                title="Khởi động lại ván chơi"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Chơi lại</span>
              </button>

              <button
                type="button"
                onClick={() => window.open(activeGame.url, '_blank', 'noopener,noreferrer')}
                className="preview-open-btn"
                title="Mở game sang tab trình duyệt riêng"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Mở tab mới</span>
              </button>

              <button
                type="button"
                onClick={toggleExpand}
                className="btn-primary btn-sm"
                title="Phóng to toàn màn hình"
              >
                {expanded ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    <span>Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    <span>Toàn màn hình</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3D Interactive Stage + Optional Guide Drawer */}
          <div className="flex flex-1 min-h-0 gap-4 overflow-hidden">
            <div
              ref={stageRef}
              className={
                theaterMode
                  ? 'fixed inset-0 z-[100] bg-canvas p-2 sm:p-3 flex flex-col'
                  : 'relative flex-1 min-h-[460px] h-full overflow-hidden rounded-2xl border border-line shadow-lg bg-elevated'
              }
            >
              {expanded && (
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="absolute right-4 bottom-20 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-slate-900/75 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-lg hover:bg-slate-900 transition-all cursor-pointer"
                  title="Thoát toàn màn hình (ESC)"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  Thoát toàn màn hình
                </button>
              )}

              <iframe
                key={`${activeGame.id}-${iframeKey}`}
                src={activeGame.url}
                title={activeGame.name}
                className="h-full w-full flex-1 border-0 rounded-xl"
                allow="fullscreen; autoplay"
                allowFullScreen
              />
            </div>

            {showGuide && (
              <aside className="w-80 flex-shrink-0 glass rounded-2xl p-4 overflow-y-auto hidden lg:flex lg:flex-col gap-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-line">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="h-4 w-4 text-brand flex-shrink-0" />
                    <h3 className="font-display text-sm font-bold text-ink truncate">
                      Mẹo chơi {activeGame.shortName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuide(false)}
                    className="btn-ghost btn-icon h-7 w-7"
                    title="Đóng hướng dẫn"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeGame.tips.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="glass-subcard p-3.5 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-brand flex-shrink-0" />
                          <p className="text-xs font-bold text-ink">{item.title}</p>
                        </div>
                        <p className="text-xs leading-relaxed text-ink-secondary">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     MODE 2: GAME CARD CATALOG VIEW (Default at /entertainment)
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-full">
      <Header
        title="Góc Giải Trí 3D"
        subtitle={`${GAMES.length} trò chơi thư giãn tương tác trực tiếp · Bấm chọn thẻ game bất kỳ để bắt đầu chơi`}
      />

      <div className="p-6 lg:p-7 space-y-5">
        {/* Filter & Search Bar */}
        <div className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-sm min-w-[200px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm game giải trí (Koi, Mèo 3D, chuông gió...)"
                className="input-glass w-full pl-10 pr-3.5 py-2 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_FILTERS.map(cat => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs sm:text-[0.84375rem] font-semibold transition-all cursor-pointer border ${
                      active
                        ? 'border-brand bg-brand text-brand-fg shadow-sm'
                        : 'border-line bg-elevated/80 text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid / List View Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-line bg-elevated/80">
            {(['grid', 'list'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  viewMode === m
                    ? 'bg-brand/15 border border-brand/35 text-brand-strong shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title={m === 'grid' ? 'Chế độ thẻ lưới' : 'Chế độ danh sách'}
              >
                {m === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center space-y-3">
            <Gamepad2 className="h-10 w-10 text-ink-muted mx-auto" />
            <p className="font-display text-base font-bold text-ink">
              Không tìm thấy game phù hợp
            </p>
            <p className="text-sm text-ink-muted">
              Hãy thử xoá từ khoá tìm kiếm hoặc chọn danh mục &ldquo;Tất cả game&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-ghost btn-sm mx-auto"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map(game => (
              <div key={game.id} className="template-card group flex flex-col">
                {/* Thumbnail Preview */}
                <div
                  onClick={() => openGame(game.id)}
                  className="relative aspect-video overflow-hidden bg-canvas border-b border-line cursor-pointer"
                >
                  <img
                    src={game.thumbnailUrl}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
                    {game.isNew && <span className="badge-published">Mới</span>}
                    <span className="rounded-full border border-white/25 bg-slate-900/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                      {game.engineBadge}
                    </span>
                  </div>

                  {/* Hover Quick Play Strip */}
                  <div
                    onClick={e => e.stopPropagation()}
                    className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-2.5 opacity-0 translate-y-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                  >
                    <button
                      type="button"
                      onClick={() => openGame(game.id)}
                      className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-fg shadow-md hover:bg-brand-strong cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Bấm vào chơi
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(game.url, '_blank', 'noopener,noreferrer')}
                      className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-md hover:border-brand/45 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Tab mới
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => openGame(game.id)}
                        className="font-display text-[1.0625rem] font-bold leading-snug text-ink group-hover:text-brand transition-colors cursor-pointer"
                      >
                        <span className="mr-1.5">{game.emoji}</span>
                        {game.name}
                      </h3>
                    </div>

                    <p className="text-sm line-clamp-3 leading-relaxed text-ink-secondary">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="chip-brand">{game.categoryLabel}</span>
                      {game.tags.map(tag => (
                        <span key={tag} className="chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-line">
                    <button
                      type="button"
                      onClick={() => window.open(game.url, '_blank', 'noopener,noreferrer')}
                      className="btn-ghost btn-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Tab riêng
                    </button>

                    <button
                      type="button"
                      onClick={() => openGame(game.id)}
                      className="btn-primary btn-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Chơi ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Horizontal List View */
          <div className="space-y-3.5">
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => openGame(game.id)}
                className="glass bento-hover rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <img
                    src={game.thumbnailUrl}
                    alt={game.name}
                    className="h-20 w-36 rounded-xl object-cover border border-line flex-shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-ink">
                        {game.emoji} {game.name}
                      </h3>
                      {game.isNew && <span className="badge-published">Mới</span>}
                      <span className="chip-brand">{game.categoryLabel}</span>
                    </div>
                    <p className="text-sm text-ink-secondary line-clamp-2 max-w-3xl">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center"
                >
                  <button
                    type="button"
                    onClick={() => window.open(game.url, '_blank', 'noopener,noreferrer')}
                    className="preview-open-btn"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Tab riêng
                  </button>
                  <button
                    type="button"
                    onClick={() => openGame(game.id)}
                    className="btn-primary btn-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Chơi ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

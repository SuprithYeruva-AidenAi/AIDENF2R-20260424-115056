import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  User,
  ChevronRight,
  FileText,
  Shield,
  Gift,
  LayoutDashboard,
} from 'lucide-react';

type Category = 'All' | 'Dining' | 'Lifestyle' | 'Service' | 'Travel';

interface RewardCard {
  id: string;
  image: string;
  logo: string;
  title: string;
  description: string;
  buttonLabel: string;
  category: Category[];
}

const REWARDS: RewardCard[] = [
  {
    id: 'kith',
    image: 'https://s3-alpha-sig.figma.com/img/3ccc/e6dc/76312628f87fe4b2face85c5785f97c9?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GhaZPejTzke73Bac0TcIa9Ka8QfE1svJkJKAmX9vBmxuxClyX5GI605d2rWLR02X70oJAWg~aalQBukfGG7TAupVf84tGtC8uA3mFFdtu~CpDDoZ5Mds6AJuHjxSvF-aAU2s7q9cTSrC7J-hZ9Lud0ik~M9Kpl7AGE1nll7LSB0tXKhuyDrgHoQ0POfuhs766Iv7Bf6dFmdIQXNB0fDua5xyOuI7jUYQu3LyrFBt8--0QBFEi9TMQpLiszMlxmo2MYx7TnEVa7aAalfEuO81Uc9UoOQDZuS3jxs1umlWslzCFI32G7Z5NDCj5UhTMnQSRhIxjPOtQ9S6PftVMJW03g__',
    logo: 'https://s3-alpha-sig.figma.com/img/86bf/5a50/b8f3a3749921a7a5868d0591a840460d?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=roDYZCuP6L95dqOCJWUcchZ3j2HP8gd~x9MbTBJCHBULbSAd3GRACaGNZVY5f2SBbAQ5~gPFsFBMqRfz~Wmpxl7Zza0ZpLgIX5D-zdEe1BVX7EPzQXCMs26Afyrz1A-k0-TDwjDGZZsfftsUINAIE~iOkoXjGMtgScU6xOOTHNW~JL6Ip4AgOGfElYKGOeHY--5sMXi6qw~KPrMS8JG~FYUqwiIZlSpEeul~A~FGVIiHHqBOi~ZO-i0OUtklAkZsjLb3iBV~NtHCeWGa6G4zy2x6cPzDyTRqHozLZSh05vQYxseV-o361MFESUfScUeQMPNGr5tIyjDkLY-BvqOaSA__',
    title: '10% off KITH by Casa Products',
    description: 'Enter promo code UOIKITH10 at checkout on www.kith.sg to enjoy the offer.',
    buttonLabel: 'Shop Now',
    category: ['Dining', 'Lifestyle'],
  },
  {
    id: 'catfiddle',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80',
    title: '10% off Cat & the Fiddle Cakes',
    description: 'Enter promo code UOICATFIDDLE10 at checkout on www.catandthefiddle to enjoy the offer.',
    buttonLabel: 'Shop Now',
    category: ['Dining'],
  },
  {
    id: 'heymax',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&q=80',
    title: '$5 Credit Reward for HEYMAX New User Sign Up',
    description: 'Enter promo code UOIHEYMAX5 during registration to enjoy $5 credit.',
    buttonLabel: 'Sign Up',
    category: ['Service', 'Travel'],
  },
  {
    id: 'mrbucket',
    image: 'https://s3-alpha-sig.figma.com/img/c9b4/dc58/3fb5be82ee7981ced52cd5ccd244b6d1?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=nd42Dp6Fe8QuJ1di7lJLG2S6Xr7NoRO6Ak2mV-e687Ce~jUG3qz0STVwJ6Y9f01q-IXfp7X1FOuKhPx7oAgLD-O8n4yuLOM~uD~MApWmd-Hl7lYxLjHHtpQ5Iz8zRNaUbAaNuGnlX37nst3tiwvbO9ZWrxClldjL6f5F9LsTOqXF~xF8HuAiaYmn0gq6PsxZlOSjv7c49pbIm8bGko1pWeBhe1Imujo7CoIv6C78Ay3aWr-b0Gk~BoZ9X~tCboxXv-ToXAYDK38FAVr9SmGLky8EnPRZ1HKk0i~r7wlJ2QDfJbHL7-9hAG6VlPbm4D4OESbACxNwGo5qYL-83RrkkQ__',
    logo: 'https://s3-alpha-sig.figma.com/img/dac8/03e3/2c32d67e08e0352ba10a7db6e21bd474?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pbPeT76JKgUFKCcHA7sNd9HqVjBx1bKBhksBCZZY1jRa28Adb6~KoMQY-Jbl2PhTDGPoLMku2m2OV~PwByuvqvaZoZvL9OLqdHBLBJ7X2pHt~a3873zeXd8qhxODOk3wbwLAv7N26gGTWZQJfCALW4hty0rRCq5Vaecmr24C8beNmIwPL1glUHEa2KenZ5xsP-QsezQP2f-MvEllEi4HMhCFH5Oh~O9MorJcuTZa-idjRdCMcIQeiNRfG4S9MiVAGint4m2wBqRfgliitJFA6zJwWrJRzNgOX3C82RpsSiBMXI1H3q~IaNqAjhEWK~314QGtIWm0pV4EO1iImqV5FA__',
    title: '10% off Mr. Bucket Chocolaterie (min S$50 spend)',
    description: 'Enter promo code UOIMRBUCKET10 at checkout on www.mrbucket.sg to enjoy.',
    buttonLabel: 'Shop Now',
    category: ['Dining', 'Lifestyle'],
  },
  {
    id: 'healthcollective',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&q=80',
    title: 'Complimentary Wellness Talk by Health Collective',
    description: 'Enjoy a complimentary wellness talk (worth $80), limited slots available for UOI customers.',
    buttonLabel: 'View Now',
    category: ['Lifestyle', 'Service'],
  },
];

const CATEGORIES: Category[] = ['All', 'Dining', 'Lifestyle', 'Service', 'Travel'];

export default function Rewards() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const filtered = activeCategory === 'All'
    ? REWARDS
    : REWARDS.filter(r => r.category.includes(activeCategory));

  return (
    <div className="h-screen flex flex-col overflow-hidden font-[Noto_Sans]">
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside
          className={`h-full shrink-0 flex flex-col bg-white border-r border-[#000000]/[0.09] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-[240px]' : 'w-[72px]'
          }`}
        >
          <div className="flex flex-col gap-[24px] p-[16px] flex-1">
            {/* Logo */}
            <div className="flex flex-col gap-[10px]">
              {sidebarOpen && (
                <img
                  src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__"
                  alt="UOI Logo"
                  className="w-[100px] h-[51px] object-contain"
                />
              )}
              {!sidebarOpen && <div className="w-[24px] h-[51px]" />}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-[12px]">
              {navItems.map(item => {
                const isActive = item.path === '/rewards';
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#005eb8]/10 to-[#5c55eb]/10 text-[#005eb8]'
                        : 'text-[#6e6e6e] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <item.icon className="w-[24px] h-[24px] shrink-0" />
                    {sidebarOpen && (
                      <span className={`text-[16px] leading-[24px] font-[Noto_Sans] ${
                        isActive ? 'text-[#005eb8] font-medium' : 'text-[#212121]'
                      }`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Collapse toggle */}
          <div className="p-[16px] flex justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-[4px] rounded-[8px] hover:bg-[#f5f5f5] cursor-pointer"
            >
              <PanelLeft className="w-[24px] h-[24px] text-[#6e6e6e]" />
            </button>
          </div>
        </aside>

        {/* Main content column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">

          {/* Header */}
          <header className="w-full flex items-center justify-between px-[24px] py-[12px] bg-white border-b border-[#000000]/[0.09] shrink-0">
            <div className="flex-1" />
            <div className="flex items-center gap-[20px]">
              <HelpCircle
                className="w-[24px] h-[24px] text-[#6e6e6e] cursor-pointer"
                onClick={() => navigate('/faq')}
              />
              <Bell className="w-[24px] h-[24px] text-[#6e6e6e] cursor-pointer" />
              <div className="w-px h-[32px] bg-[#000000]/[0.09]" />
              <div
                className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#b3d1ff] cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <User className="w-[20px] h-[20px] text-[#005eb8]" />
              </div>
              <div
                className="flex items-center gap-[4px] cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <span className="text-[14px] font-medium text-[#212121] font-[Noto_Sans]">CW</span>
                <ChevronRight className="w-[16px] h-[16px] text-[#6e6e6e]" />
              </div>
            </div>
          </header>

          {/* Scrollable main */}
          <main className="flex-1 overflow-y-auto bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
            <div className="flex flex-col items-center px-[32px] py-[48px] pb-[100px] gap-[28px]">
              <div className="flex flex-col gap-[32px] w-full max-w-[980px]">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-[4px]">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-[4px] cursor-pointer hover:opacity-80"
                  >
                    <LayoutDashboard className="w-[16px] h-[16px] text-[#6e6e6e]" />
                    <span className="text-[12px] leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Dashboard</span>
                  </button>
                  <ChevronRight className="w-[10px] h-[17px] text-[#6e6e6e]" />
                  <div className="flex items-center gap-[4px]">
                    <Gift className="w-[16px] h-[16px] text-[#005eb8]" />
                    <span className="text-[12px] leading-[16.8px] text-[#005eb8] font-bold font-[Noto_Sans]">Rewards</span>
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex flex-col gap-[12px] flex-1">
                    <span className="text-[32px] font-bold leading-[38.4px] text-[#212121] font-[Noto_Sans]">Rewards</span>
                  </div>
                </div>

                {/* Category pills */}
                <div className="flex items-center gap-[12px] flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center justify-center px-[20px] py-[8px] gap-[10px] rounded-[24px] text-[14px] leading-[21px] font-[Noto_Sans] cursor-pointer transition-colors ${
                        activeCategory === cat
                          ? 'bg-[#005eb8] text-white font-medium'
                          : 'bg-white text-[#6e6e6e] border border-[#000000]/[0.09] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Cards grid */}
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
                    <Gift className="w-[48px] h-[48px] text-[#8d8d8d]" />
                    <p className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans]">Coming soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] items-stretch">
                    {filtered.map(card => (
                      <div
                        key={card.id}
                        className="h-full flex flex-col bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden"
                      >
                        {/* Card image with overlapping logo */}
                        <div className="relative w-full h-[176px] shrink-0 overflow-hidden rounded-tl-[8px] rounded-tr-[8px]">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <img
                            src={card.logo}
                            alt="brand logo"
                            className="absolute top-[8px] left-[8px] w-[52px] h-[52px] rounded-full object-cover shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)]"
                          />
                        </div>

                        {/* Card body */}
                        <div className="flex-1 flex flex-col justify-between p-[16px] gap-[24px] rounded-bl-[8px] rounded-br-[8px]">
                          <div className="flex flex-col gap-[12px]">
                            <p className="text-[16px] font-medium leading-[24px] text-[#212121] font-[Noto_Sans]">
                              {card.title}
                            </p>
                            <p className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">
                              {card.description}
                            </p>
                          </div>
                          <button
                            onClick={() => {}}
                            className="flex items-center justify-center px-[16px] py-[12px] gap-[10px] bg-[#005eb8] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] text-[16px] font-medium leading-[24px] text-white font-[Noto_Sans] cursor-pointer hover:opacity-90 transition-opacity w-auto self-start"
                          >
                            {card.buttonLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
              <span className="text-[14px] leading-[21px] text-white font-[Noto_Sans] text-center md:text-left">
                Copyright &copy; 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.
              </span>
              <span className="text-[14px] leading-[21px] text-white font-[Noto_Sans] text-center md:text-right">
                All Rights Reserved.
              </span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

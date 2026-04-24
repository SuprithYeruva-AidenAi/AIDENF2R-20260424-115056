import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronLeft,
  Car,
  FileText,
  Gift,
  Settings,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Shield,
  User,
  AlertCircle,
} from 'lucide-react';
import {
  DashboardService,
  type DashboardModel,
  type DashboardCard,
} from '../services/dashboardService';
import { UOITimeoutError, UOIUnavailableError, UOIUpstreamError } from '../api/uoi';

// Landing page (route "/")
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col font-[Noto_Sans] overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left panel */}
        <div className="flex-1 flex flex-col items-center justify-center py-[40px] px-[24px] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
          <div className="w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[32px] bg-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.56)_0%,_rgba(255,255,255,0.08)_100%)] rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
            {/* Header */}
            <div className="flex flex-col items-center gap-[12px] w-full">
              <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
              <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Welcome to UOI Customer Portal</p>
              <p className="text-[16px] leading-[24px] text-[#212121] text-center">Manage all your policies in one portal.</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center gap-[24px] w-full">
              {/* Singpass button */}
              <img
                src="https://s3-alpha-sig.figma.com/img/5066/4d16/b727ff45ca18ad961c6d3df8c1fcd1b3?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FjqHumJtGyZGxD-rXOUogsw~Ee7zhArPCvFgWkRj7iPylXJtIpjUblIJEcXpIrx3-yZ~InFFfJXFj0J1AEfu8FUHqPgv3QHUJhGRbc~MoPLAH7I515FGP5c6H8orlkc2IDeON6kPGJqe3TJVYUcROI7GtBfB8J~5Z~8tkHnUdAvEkGlzd7-~MJDpCW7zcbZRCGHmDVLJudLB3woye9m0NF-qCKMKLH9VIdBRLKM5vR0GqLNMkdX1fXHty5PnjsXFHGW9SgcrSZ1J~Dg2AJgwYQDlSgLAk6sqoBcqGmqBI0YnL9W4YxIT5quGUQdrmvhDg0sBJxAL7CMrx4OXyh9e0g__"
                alt="Log in with Singpass"
                className="w-[200px] h-[42px] object-contain cursor-pointer"
                onClick={() => navigate('/singpass')}
              />

              {/* Or divider */}
              <div className="flex items-center gap-[16px] w-full">
                <div className="flex-1 h-px bg-[#e0e0e0]" />
                <span className="text-[16px] leading-[24px] text-[#212121]">or</span>
                <div className="flex-1 h-px bg-[#e0e0e0]" />
              </div>

              {/* NRIC/FIN button */}
              <button
                onClick={() => navigate('/login')}
                className="w-[200px] h-[42px] bg-white rounded-[8px] border border-[#005eb8] text-[16px] font-medium text-[#005eb8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-[#005eb8]/5 transition-colors"
              >
                Log in with NRIC/FIN
              </button>
            </div>
          </div>

          {/* Below card links */}
          <div className="flex flex-col gap-[12px] w-full max-w-[420px] mt-[24px]">
            <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
              Don't have an account?{' '}
              <span className="text-[#005eb8] cursor-pointer underline" onClick={() => navigate('/create-account')}>Create an account</span>
            </p>
            <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
              If you're experiencing login issues, please contact us at{' '}
              <a href="mailto:help@uoi.com.sg" className="text-[#005eb8]">help@uoi.com.sg.</a>
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden md:block md:flex-1 relative">
          <img src="https://s3-alpha-sig.figma.com/img/aab6/0921/4d0afc4bf990cf584c0c3c3e94ab342d?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=evV6xk8x8mXwhl5DIkzHg2YvXWJLdjUEE4QzPiw6skwI8IIpjBvimdVwPWI3lvrYlZLeVrGLuFRhJSyQ4GLkoIysQRqfpOJ8dmtuYTF0s9CS2fmpshgKg~eT~~cvuqARWBTTgJbpm4EKFFQe~kRYW2YGiRqEXepHLEst6q0xBDgHIiQabxEZE9VchjDafhutP34bXOqxyem451w8M82FG1pcJ~uI8MojTj-DkPpVSG9U6c-dXDkuPq2ZLzeGBzySFlIhRmWkDUzHDYlXHEUa6ro4WFSx71OMT6F2uglnWSRUKZQXRbtGsylqIereApngRcCLus72riI1Hx4ANuxYcA__" alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

// Dashboard page
function DashboardPage() {
  const navigate = useNavigate();
  const [model, setModel] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const didFetch = useRef(false);

  // Banner carousel
  const bannerSlides = ['https://s3-alpha-sig.figma.com/img/b174/518e/b937b0d57f4c2d0945d9af6744ea37cb?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IgUA6SYvFf2bjGgsXM9J5LdtV64i7P4flXUmwMMHKPU2p-1U2k5xNVoMDLJGb36~0R9fhLA3-R4J8Oa6ZcLqag1QpNk-HKKxxuU-CGLDPXJ2bCTGjAYI75AgmPGXwCbFnru0pQrP17-RGZWVmZztqjrrj0iyzMaGAQi~e3rOYgP~wEvKIk~GREpl6aAlwcSxDSPWAwZ2HudtFnl80kbsFHUXAwYD7eLzdB1NQekU82kBZTpg1MxSE~pEY11CYUeEZ84SO-hyRPP68HVlYDyWBWmAFvksSIFj7q4WsTeptzmtxQeWEv2o2YTErSwcjm4BaJC1BmcmX7hfIVbtkZtFbw__', 'https://s3-alpha-sig.figma.com/img/b174/518e/b937b0d57f4c2d0945d9af6744ea37cb?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IgUA6SYvFf2bjGgsXM9J5LdtV64i7P4flXUmwMMHKPU2p-1U2k5xNVoMDLJGb36~0R9fhLA3-R4J8Oa6ZcLqag1QpNk-HKKxxuU-CGLDPXJ2bCTGjAYI75AgmPGXwCbFnru0pQrP17-RGZWVmZztqjrrj0iyzMaGAQi~e3rOYgP~wEvKIk~GREpl6aAlwcSxDSPWAwZ2HudtFnl80kbsFHUXAwYD7eLzdB1NQekU82kBZTpg1MxSE~pEY11CYUeEZ84SO-hyRPP68HVlYDyWBWmAFvksSIFj7q4WsTeptzmtxQeWEv2o2YTErSwcjm4BaJC1BmcmX7hfIVbtkZtFbw__', 'https://s3-alpha-sig.figma.com/img/b174/518e/b937b0d57f4c2d0945d9af6744ea37cb?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IgUA6SYvFf2bjGgsXM9J5LdtV64i7P4flXUmwMMHKPU2p-1U2k5xNVoMDLJGb36~0R9fhLA3-R4J8Oa6ZcLqag1QpNk-HKKxxuU-CGLDPXJ2bCTGjAYI75AgmPGXwCbFnru0pQrP17-RGZWVmZztqjrrj0iyzMaGAQi~e3rOYgP~wEvKIk~GREpl6aAlwcSxDSPWAwZ2HudtFnl80kbsFHUXAwYD7eLzdB1NQekU82kBZTpg1MxSE~pEY11CYUeEZ84SO-hyRPP68HVlYDyWBWmAFvksSIFj7q4WsTeptzmtxQeWEv2o2YTErSwcjm4BaJC1BmcmX7hfIVbtkZtFbw__'];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % bannerSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    DashboardService.getSummary(ctrl.signal)
      .then(m => setModel(m))
      .catch(e => {
        if (e?.name === 'AbortError') return;
        if (e instanceof UOITimeoutError) setError('The service timed out. Please try again.');
        else if (e instanceof UOIUnavailableError) setError('The service is temporarily unavailable. Please try again shortly.');
        else if (e instanceof UOIUpstreamError) setError('Something went wrong. Please try again.');
        else setError('Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const handleRefresh = () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    DashboardService.refreshSummary(ctrl.signal)
      .then(setModel)
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  };

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const getCardIcon = (productCode: string) => {
    switch (productCode) {
      case 'TR01': return <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
      case 'HM01': return <Home className="w-[24px] h-[24px]" />;
      case 'MO01': return <Car className="w-[24px] h-[24px]" />;
      case 'PA01': return <User className="w-[24px] h-[24px]" />;
      default: return <Shield className="w-[24px] h-[24px]" />;
    }
  };

  const getCardName = (productCode: string) => {
    switch (productCode) {
      case 'TR01': return 'Travel';
      case 'HM01': return 'Home';
      case 'MO01': return 'Motor';
      case 'PA01': return 'Helper';
      default: return productCode;
    }
  };

  const rewardCards = [
    {
      img: 'https://s3-alpha-sig.figma.com/img/3ccc/e6dc/76312628f87fe4b2face85c5785f97c9?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GhaZPejTzke73Bac0TcIa9Ka8QfE1svJkJKAmX9vBmxuxClyX5GI605d2rWLR02X70oJAWg~aalQBukfGG7TAupVf84tGtC8uA3mFFdtu~CpDDoZ5Mds6AJuHjxSvF-aAU2s7q9cTSrC7J-hZ9Lud0ik~M9Kpl7AGE1nll7LSB0tXKhuyDrgHoQ0POfuhs766Iv7Bf6dFmdIQXNB0fDua5xyOuI7jUYQu3LyrFBt8--0QBFEi9TMQpLiszMlxmo2MYx7TnEVa7aAalfEuO81Uc9UoOQDZuS3jxs1umlWslzCFI32G7Z5NDCj5UhTMnQSRhIxjPOtQ9S6PftVMJW03g__',
      logo: 'https://s3-alpha-sig.figma.com/img/86bf/5a50/b8f3a3749921a7a5868d0591a840460d?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=roDYZCuP6L95dqOCJWUcchZ3j2HP8gd~x9MbTBJCHBULbSAd3GRACaGNZVY5f2SBbAQ5~gPFsFBMqRfz~Wmpxl7Zza0ZpLgIX5D-zdEe1BVX7EPzQXCMs26Afyrz1A-k0-TDwjDGZZsfftsUINAIE~iOkoXjGMtgScU6xOOTHNW~JL6Ip4AgOGfElYKGOeHY--5sMXi6qw~KPrMS8JG~FYUqwiIZlSpEeul~A~FGVIiHHqBOi~ZO-i0OUtklAkZsjLb3iBV~NtHCeWGa6G4zy2x6cPzDyTRqHozLZSh05vQYxseV-o361MFESUfScUeQMPNGr5tIyjDkLY-BvqOaSA__',
      title: '10% off KITH by Casa Products',
      desc: 'Enter promo code UOIKITH10 at checkout on www.kith.sg to enjoy the offer.',
      cta: 'Shop Now',
    },
    {
      img: 'https://s3-alpha-sig.figma.com/img/85ca/0b3b/5576e86be97d861823edf673af1c11f8?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=a6Q-4PS8zNmSpAlOSoIJckd-Mt0qPamBFfQwVawVB17k1R2k9ZcuGq~PaW-ZT2ay39Qh8WjdKmxuuBYNPbv5lOgShBkXaAcv3ruXC9eMwKH9PX9v3fCc5~zoDXLOYJqxtDA5bhwtsvSPYkBzux3Zfy~SMuQp2xHuTup6mt6YBAU1v0fsvO~oTQz0m4ZSCJauehADpfMW1t~SGV9iRdMU9FyYMBzG6FSD0sQwyGelAAtRYF036ATKHMGRAGK-pCF1cZ51tzAsQ8QNn6bRnPHXXqc1inCVU4sS6iajgHw0dF1~ZtExq32bAJ-BvfBu3EMwZhHmbuih0NRGLGfmCXciyw__',
      logo: 'https://s3-alpha-sig.figma.com/img/0a97/bee0/ba771711c17f9b573620e9c39ee75371?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=AaIqBKwZJBxD-AYIr1D7d-Z-tU9A4QIBUyszzsTsVZizP~YcsLXaaYNg7RPa9KLFNbjlb6o1dlvRj4xnQvG8VIKpThOeQx1BpwcAA6dnnXi0Fy82kW4OkQPf4vdo8UU01vpg50tFd85zpcPGfYitrrXI7qRctA0f0cGceOhaYnBVVrLP2ALIEMUQ8otnv7v6hkXG7O~wtmP982yugkwlmjf0eSf155azufB4AmbUPrl8q1Jd6XRkHBCXFNmg03L7jtWSwFvpFl4gk2rNCoyQHU50~aWwtJmn0WqoGC-SyEjL6AMcU6FbN-OGFnwCFjfeKR76n2hGjcKMRC2-r0phng__',
      title: '10% off Cat & the Fiddle Cakes',
      desc: 'Enter promo code UOICATFIDDLE10 at checkout on www.catandthefiddle.com to enjoy the offer.',
      cta: 'Shop Now',
    },
    {
      img: 'https://s3-alpha-sig.figma.com/img/8287/f018/93dadb02e8922d16e90a39a645f04366?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FvBJcOyMPYJHiTC4X9l8Vkx13O3GdrJe7wpaabFamd~EcJzIoVR3jvqG2QnO98WXacHJpRnCEAR9wgS5aRkeBPplVEFH9F6t2AS56pHoZxV498Os0MDS0UrLQaG-4rGLR7p2LOOQ4EEXMvv09A6st8XqSQMUGZSuV1J8vH27mPhK6-udbegy~TWKGmOZ7VDiVZgGVt9isDg7u5LTihrUGxbcKtABoSkFE0CaO36TjvHaRRwbgMesxCzovYOA~~utbTHg1RZiBZqTUFxDDUgxybvkMNkYLCoH9~uQGrAS~8fPPx-ljm8iDmFwEdLR-L0rzG-u-lR9g0HBGraZdeAajA__',
      logo: 'https://s3-alpha-sig.figma.com/img/3aa6/8189/82dafd597dffb5e00a3a6d89d162beec?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TOw1O9cQBy-MGUjIPJVPwkDsmgJIL4PN5crLB9WM5I73zJiYN1UpUItZE1A6iz9GEBi-E6tJjUDsrH4nAjaRlDbhKLQ7lENfpvExbfAW6nlRTMUyJscu5BqxVgmO1bSq1xhwnJqwxKZSWwKspmbPRjudGhOnEL3qq4YTvu9CygBP~P8nUDXRTFj2a0LBGNoig~VmfFFxZzTVpkgAP0SqKBi4cI-fKJQOspOmYGSqozxVqXI66MvEFy4~dbIoCUOV68OvGqYh4yoploGPlWvii7by00kY6JHa3c~PaAWEMihmm2S9InzyDdfq7y0~-zJqdGjbe-qHdeqW-Iq6-kRMEg__',
      title: '$5 Credit Reward for HEYMAX New User Sign Up',
      desc: 'Enter promo code UOIHEYMAX5 during registration to enjoy $5 credit.',
      cta: 'Sign Up',
    },
  ];

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
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[51px] object-contain" />
              )}
              {!sidebarOpen && <div className="w-[24px]" />}
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-[12px]">
              {navItems.map(item => {
                const isActive = item.path === '/dashboard';
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
                      <span className={`text-[16px] font-medium leading-[24px] ${
                        isActive ? 'text-[#005eb8]' : 'text-[#6e6e6e]'
                      }`}>{item.label}</span>
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

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="w-full flex items-center justify-between px-[24px] py-[12px] bg-white border-b border-[#000000]/[0.09] shrink-0">
            <div className="flex-1" />
            <div className="flex items-center gap-[20px]">
              <HelpCircle className="w-[24px] h-[24px] text-[#6e6e6e] cursor-pointer" onClick={() => navigate('/faq')} />
              <Bell className="w-[24px] h-[24px] text-[#6e6e6e] cursor-pointer" />
              <div className="w-px h-[32px] bg-[#000000]/[0.09]" />
              <div
                className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#b3d1ff] cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <span className="text-[14px] font-bold text-[#005eb8]">CW</span>
              </div>
              <ChevronRight className="w-[16px] h-[16px] text-[#6e6e6e]" />
            </div>
          </header>

          {/* Scrollable main */}
          <main className="flex-1 overflow-y-auto bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
            <div className="max-w-[980px] mx-auto px-[32px] py-[48px] pb-[100px] flex flex-col gap-[28px]">

              {/* Error banner */}
              {error && (
                <div className="w-full flex items-center justify-between gap-[12px] px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                  <div className="flex items-center gap-[8px]">
                    <AlertCircle className="w-[20px] h-[20px] text-[#dc3545] shrink-0" />
                    <span className="text-[14px] text-[#dc3545]">{error}</span>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="shrink-0 px-[16px] py-[8px] bg-[#005eb8] text-white text-[14px] rounded-[8px] cursor-pointer hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Greeting */}
              <div className="flex flex-col gap-[12px]">
                <h1 className="text-[32px] font-bold leading-[38.4px] text-[#212121]">
                  {loading && !model ? 'Loading…' : `${model?.greeting ?? 'Good evening'}, ${model?.userName ?? 'Chris'} 👋`}
                </h1>
                <p className="text-[16px] leading-[24px] text-[#6e6e6e]">Here's an overview of your insurance policies and recent activities</p>
              </div>

              {/* Banner Carousel */}
              <div className="relative w-full h-[270px] rounded-[8px] overflow-hidden shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                <img
                  src={bannerSlides[currentSlide]}
                  alt="Marketing Banner"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <button
                  onClick={() => setCurrentSlide(p => (p - 1 + bannerSlides.length) % bannerSlides.length)}
                  className="absolute left-[8px] top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-[8px] shadow cursor-pointer"
                >
                  <ChevronLeft className="w-[20px] h-[20px]" />
                </button>
                <button
                  onClick={() => setCurrentSlide(p => (p + 1) % bannerSlides.length)}
                  className="absolute right-[8px] top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-[8px] shadow cursor-pointer"
                >
                  <ChevronRight className="w-[20px] h-[20px]" />
                </button>
                <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex gap-[6px]">
                  {bannerSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-[8px] h-[8px] rounded-full cursor-pointer transition-colors ${
                        i === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-[20px]">
                <h2 className="text-[20px] font-bold leading-[24px] text-[#212121]">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                  {[
                    { icon: <FileText className="w-[24px] h-[24px] text-[#005eb8]" />, title: 'Submit Claim', desc: 'Prepare documents for claims', onClick: () => navigate('/claims/new') },
                    { icon: <Shield className="w-[24px] h-[24px] text-[#005eb8]" />, title: 'Buy New Policy', desc: 'Explore a wide range of policies', onClick: () => navigate('/policies') },
                    { icon: <HelpCircle className="w-[24px] h-[24px] text-[#005eb8]" />, title: 'Help & Support', desc: 'Learn more about our FAQs', onClick: () => navigate('/faq') },
                  ].map(action => (
                    <button
                      key={action.title}
                      onClick={action.onClick}
                      className="flex items-start gap-[12px] p-[16px] bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow text-left"
                    >
                      <div className="shrink-0 mt-[2px]">{action.icon}</div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[16px] font-medium leading-[24px] text-[#212121]">{action.title}</span>
                        <span className="text-[14px] leading-[21px] text-[#6e6e6e]">{action.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Your Coverage */}
              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <h2 className="text-[20px] font-bold leading-[24px] text-[#212121]">Your Coverage</h2>
                    <span className="text-[20px] leading-[24px] text-[#6e6e6e]">
                      ({loading ? '…' : (model?.cards?.length ?? 0)})
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/policies')}
                    className="flex items-center gap-[4px] text-[#0d6efd] text-[14px] cursor-pointer hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-[16px] h-[16px]" />
                  </button>
                </div>

                {/* Loading skeletons */}
                {loading && !model && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-[260px] bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
                    ))}
                  </div>
                )}

                {/* Cards from service */}
                {model && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] items-stretch">
                    {model.cards.map((card: DashboardCard) => (
                      <button
                        key={card.productCode}
                        onClick={() => navigate(`/product/${card.productCode}`)}
                        className="h-full flex flex-col bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer hover:shadow-md transition-shadow text-left"
                      >
                        {/* Card header */}
                        <div className="flex items-center justify-between px-[16px] py-[16px] border-b border-[#000000]/[0.09]">
                          <div className="flex items-center gap-[8px]">
                            <span className="text-[#005eb8]">{getCardIcon(card.productCode)}</span>
                            <span className="text-[16px] font-medium leading-[24px] text-[#212121]">{card.productName || getCardName(card.productCode)}</span>
                          </div>
                          {card.hasCoverage ? (
                            <span className="flex items-center gap-[4px] px-[8px] py-[4px] bg-gradient-to-r from-[#005eb8] to-[#8c5cf5] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                              <ShieldCheck className="w-[12px] h-[12px]" />
                              COVERED
                            </span>
                          ) : (
                            <span className="px-[8px] py-[4px] bg-[#f5f5f5] text-[#8d8d8d] text-[12px] font-medium rounded-full">
                              NOT COVERED
                            </span>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="flex-1 flex flex-col p-[16px] gap-[12px]">
                          {card.errorMessage ? (
                            <div className="flex flex-col gap-[8px]">
                              <p className="text-[14px] text-[#dc3545]">{card.errorMessage}</p>
                              <button
                                onClick={e => { e.stopPropagation(); handleRefresh(); }}
                                className="text-[14px] text-[#005eb8] underline cursor-pointer w-fit"
                              >
                                Retry
                              </button>
                            </div>
                          ) : card.hasCoverage ? (
                            <>
                              {/* Buy Now nudge for travel */}
                              {card.productCode === 'TR01' && (
                                <div className="flex items-center justify-between px-[12px] py-[8px] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07] rounded-[8px] border border-[#000000]/[0.09]">
                                  <span className="text-[14px] font-medium bg-gradient-to-r from-[#005eb8] to-[#5c55eb] bg-clip-text text-transparent">New trip? Get covered in 2 minutes.</span>
                                  <button
                                    onClick={e => { e.stopPropagation(); navigate('/policies'); }}
                                    className="shrink-0 px-[16px] py-[8px] bg-[#005eb8] text-white text-[14px] font-medium rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                                  >
                                    Buy Now
                                  </button>
                                </div>
                              )}
                              {/* Recent items */}
                              {card.recentItems.slice(0, 2).map(item => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between px-[12px] py-[12px] bg-[#f9f9f9] rounded-[12px]"
                                >
                                  <div className="flex flex-col gap-[4px] flex-1">
                                    <div className="flex items-center gap-[8px]">
                                      <span className="text-[14px] font-medium text-[#212121]">{item.title}</span>
                                      {item.status && (
                                        <span className={`text-[11px] font-medium px-[8px] py-[2px] rounded-full ${
                                          item.status === 'In Force' || item.status === 'Active'
                                            ? 'bg-[#e8f5e9] text-[#2e7d32]'
                                            : item.status === 'Expired' || item.status === 'Lapsed'
                                            ? 'bg-[#fce4ec] text-[#c62828]'
                                            : item.status === 'Renewal Due' || item.status === 'Pending'
                                            ? 'bg-[#fff8e1] text-[#e65100]'
                                            : 'bg-[#f5f5f5] text-[#8d8d8d]'
                                        }`}>
                                          {item.status}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[14px] leading-[21px] text-[#6e6e6e]">Policy No: {item.id}</span>
                                  </div>
                                  <ChevronRight className="w-[16px] h-[16px] text-[#6e6e6e] shrink-0" />
                                </div>
                              ))}
                            </>
                          ) : (
                            <p className="text-[16px] leading-[24px] text-[#212121]">
                              {card.productCode === 'MO01'
                                ? 'Protect your car from $X/year with your pre-filled details. Get quote '
                                : card.productCode === 'PA01'
                                ? 'Get helper insurance from $X/year. Get quote '
                                : `Get ${card.productName || getCardName(card.productCode)} coverage from $X/year. Get quote `}
                              <span
                                className="text-[#005eb8] underline cursor-pointer"
                                onClick={e => { e.stopPropagation(); navigate('/policies'); }}
                              >
                                here
                              </span>
                              .
                            </p>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* Static extra cards matching screenshot */}
                    <div className="h-full flex flex-col bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                      <div className="flex items-center justify-between px-[16px] py-[16px] border-b border-[#000000]/[0.09]">
                        <div className="flex items-center gap-[8px]">
                          <svg className="w-[24px] h-[24px] text-[#6e6e6e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                          <span className="text-[16px] font-medium leading-[24px] text-[#212121]">Hospitalisation Protection</span>
                        </div>
                        <span className="px-[8px] py-[4px] bg-[#f5f5f5] text-[#8d8d8d] text-[12px] font-medium rounded-full">NOT COVERED</span>
                      </div>
                      <div className="flex-1 p-[16px]">
                        <p className="text-[16px] leading-[24px] text-[#212121]">Cover day-to-day expenses when hospitalised from $X/year. Get quote <span className="text-[#005eb8] underline cursor-pointer" onClick={() => navigate('/policies')}>here</span>.</p>
                      </div>
                    </div>

                    <div className="h-full flex flex-col bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                      <div className="flex items-center justify-between px-[16px] py-[16px] border-b border-[#000000]/[0.09]">
                        <div className="flex items-center gap-[8px]">
                          <User className="w-[24px] h-[24px] text-[#6e6e6e]" />
                          <span className="text-[16px] font-medium leading-[24px] text-[#212121]">Personal Accident</span>
                        </div>
                        <span className="px-[8px] py-[4px] bg-[#f5f5f5] text-[#8d8d8d] text-[12px] font-medium rounded-full">NOT COVERED</span>
                      </div>
                      <div className="flex-1 p-[16px]">
                        <p className="text-[16px] leading-[24px] text-[#212121]">Get medical coverage for accidents from $X/year with your pre-filled details. Get quote <span className="text-[#005eb8] underline cursor-pointer" onClick={() => navigate('/policies')}>here</span>.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rewards */}
              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-bold leading-[24px] text-[#212121]">Rewards</h2>
                  <button
                    onClick={() => navigate('/rewards')}
                    className="flex items-center gap-[4px] text-[#0d6efd] text-[14px] cursor-pointer hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-[16px] h-[16px]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] items-stretch">
                  {rewardCards.map((card, idx) => (
                    <div key={idx} className="h-full flex flex-col bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                      {/* Card image with logo overlay */}
                      <div className="relative w-full h-[176px] shrink-0">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover rounded-tl-[8px] rounded-tr-[8px]" />
                        <img
                          src={card.logo}
                          alt="Brand logo"
                          className="absolute top-[8px] left-[8px] w-[52px] h-[52px] rounded-full object-cover border-2 border-white"
                        />
                      </div>
                      {/* Card content */}
                      <div className="flex-1 flex flex-col justify-between p-[16px] gap-[12px]">
                        <div className="flex flex-col gap-[12px]">
                          <p className="text-[16px] font-medium leading-[24px] text-[#212121]">{card.title}</p>
                          <p className="text-[14px] leading-[21px] text-[#6e6e6e]">{card.desc}</p>
                        </div>
                        <button
                          onClick={() => navigate('/rewards')}
                          className="w-auto self-start px-[20px] py-[10px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          {card.cta}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
              <span className="text-[14px] leading-[21px] text-white text-center md:text-left">Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</span>
              <span className="text-[14px] leading-[21px] text-white text-center md:text-right">All Rights Reserved.</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <LandingPage />;
  }
  return <DashboardPage />;
}

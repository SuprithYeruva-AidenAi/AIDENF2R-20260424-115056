import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  ChevronRight,
  FileText,
  Gift,
  Shield,
  AlertCircle,
  Search,
  Car,
  User,
  ArrowRight,
} from 'lucide-react';
import { fetchOrderData, UOITimeoutError, UOIUnavailableError, UOIUpstreamError } from '../api/uoi';

const PRODUCT_CODES = [
  { code: 'TR01', name: 'Travel' },
  { code: 'HM01', name: 'Home' },
  { code: 'MO01', name: 'Motor' },
  { code: 'PA01', name: 'Helper' },
];

type PolicyItem = {
  id: string;
  title: string;
  status?: string;
  productCode: string;
  productName: string;
  raw: Record<string, unknown>;
};

function getStatusStyle(status?: string) {
  if (!status) return 'bg-[#f5f5f5] text-[#8d8d8d]';
  const s = status.toLowerCase();
  if (s.includes('force') || s.includes('active')) return 'bg-[#e8f5e9] text-[#2e7d32]';
  if (s.includes('expir') || s.includes('lapse') || s.includes('cancel')) return 'bg-[#fce4ec] text-[#c62828]';
  if (s.includes('renewal') || s.includes('pending') || s.includes('due')) return 'bg-[#fff8e1] text-[#e65100]';
  return 'bg-[#f5f5f5] text-[#8d8d8d]';
}

function getProductIcon(code: string) {
  switch (code) {
    case 'TR01': return <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
    case 'HM01': return <Home className="w-[20px] h-[20px]" />;
    case 'MO01': return <Car className="w-[20px] h-[20px]" />;
    case 'PA01': return <User className="w-[20px] h-[20px]" />;
    default: return <Shield className="w-[20px] h-[20px]" />;
  }
}

export default function Policies() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const fetchAllPolicies = async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        PRODUCT_CODES.map(p =>
          fetchOrderData<Record<string, unknown>>(
            { ProductCode: p.code, PageSize: 50, PageNo: 1 },
            signal,
          ).then(res => ({ res, productCode: p.code, productName: p.name }))
        )
      );

      const allItems: PolicyItem[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { res, productCode, productName } = result.value;
          const raw = res as Record<string, unknown>;
          const list: Record<string, unknown>[] = (
            (Array.isArray(raw?.data) ? raw.data :
            Array.isArray(raw?.items) ? raw.items :
            Array.isArray(raw?.policies) ? raw.policies :
            Array.isArray(raw?.result) ? raw.result :
            Array.isArray(raw?.orders) ? raw.orders :
            []) as Record<string, unknown>[]
          );
          for (const item of list) {
            const id = String(
              item['policyNo'] ?? item['PolicyNo'] ?? item['orderId'] ?? item['OrderId'] ??
              item['id'] ?? item['proposalId'] ?? ''
            );
            const title = String(
              item['productName'] ?? item['ProductName'] ?? item['planName'] ?? item['PlanName'] ??
              item['title'] ?? productName
            );
            const status = String(
              item['policyStatus'] ?? item['PolicyStatus'] ?? item['status'] ?? item['Status'] ?? ''
            ) || undefined;
            if (id) {
              allItems.push({ id, title, status: status || undefined, productCode, productName, raw: item });
            }
          }
        }
      }
      setPolicies(allItems);
    } catch (e: unknown) {
      if ((e as { name?: string })?.name === 'AbortError') return;
      if (e instanceof UOITimeoutError) setError('The service timed out. Please try again.');
      else if (e instanceof UOIUnavailableError) setError('The service is temporarily unavailable. Please try again shortly.');
      else if (e instanceof UOIUpstreamError) setError('Something went wrong. Please try again.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    const ctrl = new AbortController();
    fetchAllPolicies(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  const handleRetry = () => {
    didFetch.current = false;
    const ctrl = new AbortController();
    fetchAllPolicies(ctrl.signal);
  };

  const tabs = ['ALL', ...PRODUCT_CODES.map(p => p.code)];

  const filtered = policies.filter(p => {
    const matchTab = activeTab === 'ALL' || p.productCode === activeTab;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      (p.status ?? '').toLowerCase().includes(q) ||
      p.productName.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const tabLabel = (code: string) => {
    if (code === 'ALL') return 'All';
    return PRODUCT_CODES.find(p => p.code === code)?.name ?? code;
  };

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
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <img
                  src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__"
                  alt="UOI Logo"
                  className="w-[100px] h-[51px] object-contain"
                />
              )}
              {!sidebarOpen && <div className="w-[24px]" />}
            </div>
            <nav className="flex flex-col gap-[12px]">
              {navItems.map(item => {
                const isActive = item.path === '/policies';
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
          <div className="p-[16px] flex justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-[4px] rounded-[8px] hover:bg-[#f5f5f5] cursor-pointer"
            >
              <PanelLeft className="w-[24px] h-[24px] text-[#6e6e6e]" />
            </button>
          </div>
        </aside>

        {/* Main */}
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

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
            <div className="max-w-[980px] mx-auto px-[32px] py-[40px] pb-[80px] flex flex-col gap-[24px]">

              {/* Page title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[32px] font-bold leading-[38.4px] text-[#212121]">My Policies</h1>
                  <p className="text-[16px] leading-[24px] text-[#6e6e6e] mt-[4px]">View and manage all your insurance policies</p>
                </div>
                <button
                  onClick={() => navigate('/claims/new')}
                  className="flex items-center gap-[8px] px-[20px] py-[10px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]"
                >
                  <FileText className="w-[18px] h-[18px]" />
                  <span>Submit Claim</span>
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="w-full flex items-center justify-between gap-[12px] px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                  <div className="flex items-center gap-[8px]">
                    <AlertCircle className="w-[20px] h-[20px] text-[#dc3545] shrink-0" />
                    <span className="text-[14px] text-[#dc3545]">{error}</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="shrink-0 px-[16px] py-[8px] bg-[#005eb8] text-white text-[14px] rounded-[8px] cursor-pointer hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#8d8d8d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by policy number, product or status…"
                  className="w-full h-[48px] pl-[48px] pr-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] text-[#212121] outline-none focus:border-[#005eb8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-[8px] flex-wrap">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-[16px] py-[8px] rounded-full text-[14px] font-medium cursor-pointer transition-colors ${
                      activeTab === tab
                        ? 'bg-[#005eb8] text-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]'
                        : 'bg-white text-[#6e6e6e] border border-[#000000]/[0.09] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {tabLabel(tab)}
                    {tab !== 'ALL' && !loading && (
                      <span className="ml-[6px] text-[12px] opacity-70">
                        ({policies.filter(p => p.productCode === tab).length})
                      </span>
                    )}
                    {tab === 'ALL' && !loading && (
                      <span className="ml-[6px] text-[12px] opacity-70">({policies.length})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div className="flex flex-col gap-[12px]">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-[88px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
                  <Shield className="w-[48px] h-[48px] text-[#8d8d8d]" />
                  <p className="text-[16px] text-[#6e6e6e]">
                    {searchQuery ? 'No policies match your search.' : 'No policies found.'}
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-[8px] px-[24px] py-[12px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] cursor-pointer hover:opacity-90"
                  >
                    <span>Back to Dashboard</span>
                    <ArrowRight className="w-[16px] h-[16px]" />
                  </button>
                </div>
              )}

              {/* Policy list */}
              {!loading && filtered.length > 0 && (
                <div className="flex flex-col gap-[12px]">
                  {filtered.map(item => (
                    <button
                      key={`${item.productCode}-${item.id}`}
                      onClick={() => navigate(`/policies/${item.id}`)}
                      className="flex items-center justify-between px-[20px] py-[16px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow text-left w-full"
                    >
                      <div className="flex items-center gap-[16px] flex-1 min-w-0">
                        <div className="shrink-0 w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#005eb8]/10 to-[#5c55eb]/10 flex items-center justify-center text-[#005eb8]">
                          {getProductIcon(item.productCode)}
                        </div>
                        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                          <div className="flex items-center gap-[8px] flex-wrap">
                            <span className="text-[16px] font-medium text-[#212121] truncate">{item.title}</span>
                            {item.status && (
                              <span className={`text-[11px] font-medium px-[8px] py-[2px] rounded-full shrink-0 ${getStatusStyle(item.status)}`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-[12px] flex-wrap">
                            <span className="text-[14px] text-[#6e6e6e]">Policy No: {item.id}</span>
                            <span className="text-[12px] px-[8px] py-[2px] bg-[#f0f4ff] text-[#005eb8] rounded-full font-medium">
                              {item.productName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-[20px] h-[20px] text-[#6e6e6e] shrink-0 ml-[12px]" />
                    </button>
                  ))}
                </div>
              )}
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

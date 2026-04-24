import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronLeft,
  FileText,
  Gift,
  Shield,
  AlertCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { fetchOrderData, downloadPolicyDocument, UOITimeoutError, UOIUnavailableError, UOIUpstreamError } from '../api/uoi';

type PolicyData = Record<string, unknown>;

function formatValue(val: unknown): string {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

const SKIP_KEYS = new Set(['raw', '__typename']);

export default function PolicyDetail() {
  const { policyNo } = useParams<{ policyNo: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const fetchDetail = async (signal: AbortSignal) => {
    if (!policyNo) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrderData<PolicyData>(
        { OrderId: policyNo, PolicyNo: policyNo, policyNo },
        signal,
      );
      setData(res);
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
    fetchDetail(ctrl.signal);
    return () => ctrl.abort();
  }, [policyNo]);

  const handleRetry = () => {
    didFetch.current = false;
    const ctrl = new AbortController();
    fetchDetail(ctrl.signal);
  };

  const fields: { key: string; label: string; value: string }[] = data
    ? Object.entries(data)
        .filter(([k]) => !SKIP_KEYS.has(k) && typeof data[k] !== 'object')
        .map(([k, v]) => ({ key: k, label: formatKey(k), value: formatValue(v) }))
    : [];

  const sections: { title: string; entries: { label: string; value: string }[] }[] = data
    ? Object.entries(data)
        .filter(([k, v]) => !SKIP_KEYS.has(k) && v !== null && typeof v === 'object' && !Array.isArray(v))
        .map(([k, v]) => ({
          title: formatKey(k),
          entries: Object.entries(v as Record<string, unknown>)
            .filter(([sk]) => !SKIP_KEYS.has(sk))
            .map(([sk, sv]) => ({ label: formatKey(sk), value: formatValue(sv) })),
        }))
    : [];

  const policyStatus = data
    ? String(data['policyStatus'] ?? data['PolicyStatus'] ?? data['status'] ?? data['Status'] ?? '')
    : '';

  const productName = data
    ? String(data['productName'] ?? data['ProductName'] ?? data['planName'] ?? data['PlanName'] ?? 'Policy')
    : 'Policy';

  function getStatusStyle(status: string) {
    const s = status.toLowerCase();
    if (s.includes('force') || s.includes('active')) return 'bg-[#e8f5e9] text-[#2e7d32]';
    if (s.includes('expir') || s.includes('lapse') || s.includes('cancel')) return 'bg-[#fce4ec] text-[#c62828]';
    if (s.includes('renewal') || s.includes('pending') || s.includes('due')) return 'bg-[#fff8e1] text-[#e65100]';
    return 'bg-[#f5f5f5] text-[#8d8d8d]';
  }

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

              {/* Back */}
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={() => navigate('/policies')}
                  className="flex items-center gap-[4px] text-[#6e6e6e] cursor-pointer hover:text-[#212121]"
                >
                  <ChevronLeft className="w-[20px] h-[20px]" />
                  <span className="text-[14px] leading-[21px]">Back to Policies</span>
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

              {/* Loading */}
              {loading && (
                <div className="flex flex-col gap-[16px]">
                  <div className="h-[120px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
                  <div className="h-[200px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
                  <div className="h-[160px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
                </div>
              )}

              {/* Policy detail */}
              {!loading && data && (
                <>
                  {/* Hero card */}
                  <div className="bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-[24px] py-[20px] bg-gradient-to-r from-[#005eb8] to-[#5c55eb] flex items-center justify-between">
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[20px] font-bold text-white">{productName}</span>
                        <span className="text-[14px] text-white/80">Policy No: {policyNo}</span>
                      </div>
                      <div className="flex items-center gap-[12px]">
                        {policyStatus && (
                          <span className={`text-[12px] font-medium px-[12px] py-[4px] rounded-full ${getStatusStyle(policyStatus)}`}>
                            {policyStatus}
                          </span>
                        )}
                        <button
                          onClick={handleRetry}
                          className="p-[8px] bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
                          title="Refresh"
                        >
                          <RefreshCw className="w-[16px] h-[16px] text-white" />
                        </button>
                        {policyNo && (
                          <a
                            href={downloadPolicyDocument(policyNo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[6px] px-[16px] py-[8px] bg-white text-[#005eb8] text-[14px] font-medium rounded-[8px] cursor-pointer hover:bg-white/90 transition-colors"
                          >
                            <Download className="w-[16px] h-[16px]" />
                            <span>Download PDF</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {fields.length > 0 && (
                      <div className="px-[24px] py-[20px] grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[16px]">
                        {fields.map(f => (
                          <div key={f.key} className="flex flex-col gap-[4px]">
                            <span className="text-[12px] leading-[16.8px] text-[#8d8d8d] uppercase tracking-wide">{f.label}</span>
                            <span className="text-[15px] leading-[22px] text-[#212121] font-medium break-words">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nested sections */}
                  {sections.map(section => (
                    <div key={section.title} className="bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                      <div className="px-[24px] py-[16px] border-b border-[#000000]/[0.09]">
                        <h2 className="text-[16px] font-bold text-[#212121]">{section.title}</h2>
                      </div>
                      <div className="px-[24px] py-[20px] grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[16px]">
                        {section.entries.map(e => (
                          <div key={e.label} className="flex flex-col gap-[4px]">
                            <span className="text-[12px] leading-[16.8px] text-[#8d8d8d] uppercase tracking-wide">{e.label}</span>
                            <span className="text-[15px] leading-[22px] text-[#212121] font-medium break-words">{e.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-[12px]">
                    <button
                      onClick={() => navigate('/claims/new')}
                      className="flex items-center gap-[8px] px-[20px] py-[10px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]"
                    >
                      <FileText className="w-[18px] h-[18px]" />
                      <span>Submit Claim</span>
                    </button>
                    <button
                      onClick={() => navigate('/policies')}
                      className="flex items-center gap-[8px] px-[20px] py-[10px] bg-white text-[#005eb8] text-[16px] font-medium rounded-[8px] border border-[#005eb8] cursor-pointer hover:bg-[#005eb8]/5 transition-colors"
                    >
                      <span>Back to Policies</span>
                    </button>
                  </div>
                </>
              )}

              {/* No data */}
              {!loading && !error && !data && (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
                  <Shield className="w-[48px] h-[48px] text-[#8d8d8d]" />
                  <p className="text-[16px] text-[#6e6e6e]">Policy details not found.</p>
                  <button
                    onClick={() => navigate('/policies')}
                    className="px-[24px] py-[12px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] cursor-pointer hover:opacity-90"
                  >
                    Back to Policies
                  </button>
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

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronDown,
  FileText,
  Gift,
  Shield,
  AlertCircle,
  ArrowUpDown,
  LayoutDashboard,
  FileCheck,
  User,
  RefreshCw,
} from 'lucide-react';
import { findIssuedPolicies, UOITimeoutError, UOIUnavailableError, UOIUpstreamError } from '../api/uoi';

type ClaimStatus = 'Submitted' | 'Draft' | 'Closed' | 'All';

interface ClaimItem {
  id: string;
  policyProduct: string;
  policyNo: string;
  claimDescription: string;
  referenceNo: string;
  status: string;
  dateSubmitted: string;
  raw: Record<string, unknown>;
}

function statusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === 'submitted') return { bg: 'bg-[#d8ffe2]', text: 'text-[#28a745]' };
  if (s === 'draft') return { bg: 'bg-[#fff8e1]', text: 'text-[#e65100]' };
  if (s === 'closed') return { bg: 'bg-[#f5f5f5]', text: 'text-[#8d8d8d]' };
  return { bg: 'bg-[#f5f5f5]', text: 'text-[#8d8d8d]' };
}

function shapeClaimItem(raw: Record<string, unknown>): ClaimItem {
  const str = (keys: string[]): string => {
    for (const k of keys) {
      const v = raw[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
    }
    return '';
  };

  // Derive claim description from available fields
  const desc =
    str(['claimDescription', 'ClaimDescription', 'claim_description', 'description', 'Description',
         'claimType', 'ClaimType', 'claim_type', 'lossDescription', 'LossDescription', 'remarks', 'Remarks']);

  // Derive reference number
  const ref =
    str(['referenceNo', 'ReferenceNo', 'reference_no', 'claimNo', 'ClaimNo', 'claim_no',
         'claimId', 'ClaimId', 'claim_id', 'refNo', 'RefNo']);

  // Derive status
  const status =
    str(['claimStatus', 'ClaimStatus', 'claim_status', 'status', 'Status', 'policyStatus', 'PolicyStatus']) || 'Draft';

  // Derive date
  const date =
    str(['dateSubmitted', 'DateSubmitted', 'date_submitted', 'submittedDate', 'SubmittedDate',
         'createdDate', 'CreatedDate', 'created_date', 'effectiveDate', 'EffectiveDate',
         'startDate', 'StartDate']);

  // Derive policy product name
  const product =
    str(['productName', 'ProductName', 'product_name', 'planName', 'PlanName', 'plan_name']);

  // Derive policy number
  const policyNo =
    str(['policyNo', 'PolicyNo', 'policy_no', 'policyNumber', 'PolicyNumber', 'orderId', 'OrderId', 'id']);

  const id =
    str(['claimId', 'ClaimId', 'claim_id', 'id', 'referenceNo', 'ReferenceNo', 'orderId', 'OrderId']);

  return {
    id: id || policyNo || Math.random().toString(36).slice(2),
    policyProduct: product,
    policyNo,
    claimDescription: desc,
    referenceNo: ref,
    status,
    dateSubmitted: date,
    raw,
  };
}

function extractItems(data: unknown): Record<string, unknown>[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  const d = data as Record<string, unknown>;
  for (const key of ['items', 'Items', 'data', 'Data', 'policies', 'Policies',
                      'claims', 'Claims', 'records', 'Records', 'list', 'List', 'result', 'Result']) {
    if (Array.isArray(d[key])) return d[key] as Record<string, unknown>[];
  }
  // Single object
  if (typeof d === 'object' && Object.keys(d).length > 0) return [d];
  return [];
}

export default function Claims() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data state
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  // Filter state
  const [policyFilter, setPolicyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus>('All');
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Sort state
  const [sortAsc, setSortAsc] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const fetchClaims = (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    // UOI has no dedicated claims endpoint.
    // Per SCRUM-19: use findIssuedPolicies with hasClaim flag to get claim-eligible records.
    findIssuedPolicies({ PageSize: 100, PageNo: 1 }, signal)
      .then((res: unknown) => {
        const rows = extractItems(res);
        const shaped = rows.map(r => shapeClaimItem(r as Record<string, unknown>));
        setClaims(shaped);
      })
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === 'AbortError') return;
        if (e instanceof UOITimeoutError) setError('The service timed out. Please try again.');
        else if (e instanceof UOIUnavailableError) setError('The service is temporarily unavailable. Please try again shortly.');
        else if (e instanceof UOIUpstreamError) setError('Something went wrong. Please try again.');
        else setError('Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    const ctrl = new AbortController();
    fetchClaims(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  const handleRetry = () => {
    didFetch.current = false;
    const ctrl = new AbortController();
    fetchClaims(ctrl.signal);
  };

  // Unique policy options for filter
  const policyOptions = ['All', ...Array.from(new Set(claims.map(c => c.policyProduct).filter(Boolean)))];
  const statusOptions: ClaimStatus[] = ['All', 'Submitted', 'Draft', 'Closed'];

  const handleClearFilter = () => {
    setPolicyFilter('All');
    setStatusFilter('All');
  };

  // Filtered + sorted claims
  const filtered = claims
    .filter(c => {
      const matchPolicy = policyFilter === 'All' || c.policyProduct === policyFilter;
      const matchStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchPolicy && matchStatus;
    })
    .sort((a, b) => {
      const da = a.dateSubmitted || '';
      const db = b.dateSubmitted || '';
      return sortAsc ? da.localeCompare(db) : db.localeCompare(da);
    });

  const isEmpty = !loading && !error && filtered.length === 0;

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
                <img
                  src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__"
                  alt="UOI Logo"
                  className="w-[100px] h-[51px] object-contain"
                />
              )}
              {!sidebarOpen && <div className="w-[24px]" />}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-[12px]">
              {navItems.map(item => {
                const isActive = item.path === '/claims';
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
                        isActive ? 'text-[#005eb8]' : 'text-[#212121]'
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
                <span className="text-[14px] font-medium text-[#212121]">CW</span>
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
                    <span className="text-[14px] leading-[21px] text-[#6e6e6e]">Dashboard</span>
                  </button>
                  <ChevronRight className="w-[10px] h-[17px] text-[#6e6e6e]" />
                  <div className="flex items-center gap-[4px]">
                    <FileCheck className="w-[16px] h-[16px] text-[#005eb8]" />
                    <span className="text-[14px] leading-[21px] text-[#005eb8] font-medium">Claims</span>
                  </div>
                </div>

                {/* Title row */}
                <div className="flex items-center justify-between gap-[12px] w-full">
                  <span className="text-[32px] font-bold leading-[38.4px] text-[#212121] font-[Noto_Sans]">Claims</span>
                  <button
                    onClick={() => navigate('/claims/new')}
                    className="flex items-center justify-center px-[16px] py-[12px] gap-[10px] bg-[#005eb8] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span className="text-[16px] font-medium leading-[24px] text-white font-[Noto_Sans]">Submit Claim</span>
                  </button>
                </div>

                {/* Error banner */}
                {error && (
                  <div className="flex items-center justify-between gap-[12px] px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <AlertCircle className="w-[20px] h-[20px] text-[#dc3545] shrink-0" />
                      <span className="text-[14px] text-[#dc3545]">{error}</span>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="shrink-0 flex items-center gap-[6px] px-[16px] py-[8px] bg-[#005eb8] text-white text-[14px] rounded-[8px] cursor-pointer hover:opacity-90"
                    >
                      <RefreshCw className="w-[14px] h-[14px]" />
                      Retry
                    </button>
                  </div>
                )}

                {/* Table card */}
                <div className="w-full bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">

                  {/* Filter row */}
                  <div className="flex items-center px-[24px] pt-[24px] pb-[8px] gap-[24px] bg-white rounded-[8px]">
                    <div className="flex items-center gap-[16px] flex-1 h-[48px] rounded-[8px]">

                      {/* Policy filter */}
                      <div className="relative w-[230px]">
                        <button
                          onClick={() => { setPolicyDropdownOpen(o => !o); setStatusDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-[16px] py-[12px] gap-[8px] bg-white rounded-[8px] border border-[#000000]/[0.09] cursor-pointer"
                        >
                          <div className="flex items-center gap-[8px]">
                            <span className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">Policy:</span>
                            <span className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans]">{policyFilter}</span>
                          </div>
                          <ChevronDown className="w-[16px] h-[16px] text-[#6e6e6e] shrink-0" />
                        </button>
                        {policyDropdownOpen && (
                          <div className="absolute top-[calc(100%+4px)] left-0 z-20 w-full bg-white border border-[#000000]/[0.09] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                            {policyOptions.map(opt => (
                              <button
                                key={opt}
                                onClick={() => { setPolicyFilter(opt); setPolicyDropdownOpen(false); }}
                                className={`w-full text-left px-[16px] py-[10px] text-[14px] font-[Noto_Sans] hover:bg-[#f5f5f5] cursor-pointer ${
                                  policyFilter === opt ? 'text-[#005eb8] font-medium' : 'text-[#212121]'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status filter */}
                      <div className="relative w-[230px]">
                        <button
                          onClick={() => { setStatusDropdownOpen(o => !o); setPolicyDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-[16px] py-[12px] gap-[12px] bg-white rounded-[8px] border border-[#000000]/[0.09] cursor-pointer h-[45px]"
                        >
                          <div className="flex items-center gap-[8px] flex-1">
                            <span className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">Status:</span>
                            <span className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans]">{statusFilter}</span>
                          </div>
                          <ChevronDown className="w-[16px] h-[16px] text-[#6e6e6e] shrink-0" />
                        </button>
                        {statusDropdownOpen && (
                          <div className="absolute top-[calc(100%+4px)] left-0 z-20 w-full bg-white border border-[#000000]/[0.09] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                            {statusOptions.map(opt => (
                              <button
                                key={opt}
                                onClick={() => { setStatusFilter(opt); setStatusDropdownOpen(false); }}
                                className={`w-full text-left px-[16px] py-[10px] text-[14px] font-[Noto_Sans] hover:bg-[#f5f5f5] cursor-pointer ${
                                  statusFilter === opt ? 'text-[#005eb8] font-medium' : 'text-[#212121]'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Clear filter */}
                      <button
                        onClick={handleClearFilter}
                        className="text-[14px] leading-[21px] text-[#8d8d8d] font-[Noto_Sans] cursor-pointer hover:text-[#212121] transition-colors"
                      >
                        Clear Filter
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="px-[16px] pb-[16px]">

                    {/* Table header */}
                    <div className="flex items-center px-[24px] py-[12px] gap-[24px] border-b border-[#000000]/[0.09] rounded-tl-[8px] rounded-tr-[8px]">
                      <div className="flex items-center gap-[10px] w-[150px] shrink-0">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Policy Product / Policy No.</span>
                      </div>
                      <div className="flex items-center gap-[10px] w-[250px] shrink-0">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Claim Description</span>
                      </div>
                      <div className="flex items-center gap-[10px] w-[98px] shrink-0">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Reference No.</span>
                      </div>
                      <div className="flex items-center gap-[10px] w-[80px] shrink-0">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Status</span>
                      </div>
                      <div className="flex items-center gap-[4px] w-[119px] shrink-0">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Date Submitted</span>
                        <button onClick={() => setSortAsc(a => !a)} className="cursor-pointer">
                          <ArrowUpDown className="w-[24px] h-[24px] text-[#6e6e6e]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-[10px] flex-1">
                        <span className="text-[12px] font-medium leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">Action</span>
                      </div>
                    </div>

                    {/* Loading skeletons */}
                    {loading && (
                      <div className="flex flex-col gap-[0px]">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex items-center px-[24px] py-[12px] gap-[24px] border-b border-[#000000]/[0.06] animate-pulse">
                            <div className="w-[150px] h-[42px] bg-[#f5f5f5] rounded-[4px] shrink-0" />
                            <div className="w-[250px] h-[21px] bg-[#f5f5f5] rounded-[4px] shrink-0" />
                            <div className="w-[98px] h-[21px] bg-[#f5f5f5] rounded-[4px] shrink-0" />
                            <div className="w-[80px] h-[21px] bg-[#f5f5f5] rounded-[4px] shrink-0" />
                            <div className="w-[119px] h-[21px] bg-[#f5f5f5] rounded-[4px] shrink-0" />
                            <div className="flex-1 h-[21px] bg-[#f5f5f5] rounded-[4px]" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {isEmpty && (
                      <div className="flex items-center justify-center py-[80px]">
                        <span className="text-[16px] leading-[24px] text-[#212121] font-[Noto_Sans]">No history yet</span>
                      </div>
                    )}

                    {/* Claim rows */}
                    {!loading && !error && filtered.length > 0 && (
                      <div className="flex flex-col">
                        {filtered.map((claim, idx) => {
                          const st = statusStyle(claim.status);
                          return (
                            <div
                              key={`${claim.id}-${idx}`}
                              className="flex items-center px-[24px] py-[12px] gap-[24px] border-b border-[#000000]/[0.06] last:border-0 hover:bg-[#f9f9f9] transition-colors"
                            >
                              {/* Policy Product / Policy No. */}
                              <div className="flex items-center gap-[10px] w-[150px] shrink-0">
                                <div className="flex flex-col gap-[4px]">
                                  <span className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans]">
                                    {claim.policyProduct || 'Policy'}
                                  </span>
                                  {claim.policyNo && (
                                    <button
                                      onClick={() => navigate(`/policies/${claim.policyNo}`)}
                                      className="flex items-center gap-[4px] cursor-pointer hover:opacity-80"
                                    >
                                      <span className="text-[12px] leading-[16.8px] text-[#6e6e6e] font-[Noto_Sans]">
                                        {claim.policyNo.length > 14
                                          ? claim.policyNo.slice(0, 14) + '…'
                                          : claim.policyNo}
                                      </span>
                                      <ChevronRight className="w-[12px] h-[12px] text-[#6e6e6e]" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Claim Description */}
                              <div className="flex items-center gap-[10px] w-[250px] shrink-0">
                                <span
                                  className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans] line-clamp-2"
                                  title={claim.claimDescription}
                                >
                                  {claim.claimDescription || '—'}
                                </span>
                              </div>

                              {/* Reference No. */}
                              <div className="flex items-center gap-[10px] w-[98px] shrink-0">
                                <span className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans] break-all">
                                  {claim.referenceNo || '—'}
                                </span>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-[10px] w-[80px] shrink-0">
                                <span
                                  className={`inline-flex items-center justify-center px-[8px] py-[2px] rounded-[12px] text-[12px] font-medium leading-[16.8px] font-[Noto_Sans] ${
                                    st.bg
                                  } ${st.text}`}
                                >
                                  {claim.status || '—'}
                                </span>
                              </div>

                              {/* Date Submitted */}
                              <div className="flex items-center gap-[4px] w-[119px] shrink-0">
                                <span className="text-[14px] leading-[21px] text-[#212121] font-[Noto_Sans]">
                                  {claim.dateSubmitted || '—'}
                                </span>
                              </div>

                              {/* Action */}
                              <div className="flex items-center gap-[16px] flex-1">
                                <button
                                  onClick={() => navigate(`/claims/${claim.id}`)}
                                  className="text-[14px] leading-[21px] text-[#9e9e9e] font-[Noto_Sans] cursor-pointer hover:text-[#212121] transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => navigate(`/claims/${claim.id}`)}
                                  className="text-[14px] leading-[21px] text-[#0d6efd] font-[Noto_Sans] cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Record count */}
                <span className="text-[14px] leading-[21px] text-[#8d8d8d] font-[Noto_Sans] text-center w-full">
                  {loading
                    ? 'Loading records…'
                    : `Showing ${filtered.length} out of ${filtered.length} record(s)`}
                </span>

              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
              <span className="text-[14px] leading-[21px] text-white font-[Noto_Sans] text-center md:text-left">
                Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.
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

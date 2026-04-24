import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle, Shield } from 'lucide-react';
import { DashboardService } from '../services/dashboardService';
import { UOITimeoutError, UOIUnavailableError, UOIUpstreamError } from '../api/uoi';

type PolicyItem = { id: string; title: string; status?: string };

export default function ProductList() {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  const productNames: Record<string, string> = {
    TR01: 'Travel',
    HM01: 'Home',
    MO01: 'Motor',
    PA01: 'Helper',
  };

  useEffect(() => {
    if (!productCode) return;
    if (didFetch.current) return;
    didFetch.current = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    DashboardService.listByProduct(productCode, ctrl.signal)
      .then(data => setItems(data as PolicyItem[]))
      .catch(e => {
        if (e?.name === 'AbortError') return;
        if (e instanceof UOITimeoutError) setError('The service timed out. Please try again.');
        else if (e instanceof UOIUnavailableError) setError('The service is temporarily unavailable. Please try again shortly.');
        else if (e instanceof UOIUpstreamError) setError('Something went wrong. Please try again.');
        else setError('Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [productCode]);

  const productName = productCode ? (productNames[productCode] ?? productCode) : 'Product';

  return (
    <div className="min-h-screen w-full flex flex-col font-[Noto_Sans] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
      {/* Header */}
      <div className="w-full px-[32px] py-[24px] flex items-center gap-[16px] bg-white border-b border-[#000000]/[0.09]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-[4px] text-[#6e6e6e] cursor-pointer hover:text-[#212121]"
        >
          <ChevronLeft className="w-[20px] h-[20px]" />
          <span className="text-[14px] leading-[21px]">Back</span>
        </button>
        <h1 className="text-[24px] font-bold text-[#212121]">{productName} Policies</h1>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-[980px] mx-auto w-full px-[32px] py-[32px] flex flex-col gap-[16px]">
        {/* Error */}
        {error && (
          <div className="flex items-center justify-between gap-[12px] px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[8px]">
            <div className="flex items-center gap-[8px]">
              <AlertCircle className="w-[20px] h-[20px] text-[#dc3545] shrink-0" />
              <span className="text-[14px] text-[#dc3545]">{error}</span>
            </div>
            <button
              onClick={() => { didFetch.current = false; setLoading(true); setError(null); }}
              className="shrink-0 px-[16px] py-[8px] bg-[#005eb8] text-white text-[14px] rounded-[8px] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-[12px]">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[80px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
            <Shield className="w-[48px] h-[48px] text-[#8d8d8d]" />
            <p className="text-[16px] text-[#6e6e6e]">No {productName} policies found.</p>
            <button
              onClick={() => navigate('/policies')}
              className="px-[24px] py-[12px] bg-[#005eb8] text-white text-[16px] font-medium rounded-[8px] cursor-pointer hover:opacity-90"
            >
              Buy New Policy
            </button>
          </div>
        )}

        {/* Items */}
        {!loading && items.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            {items.map((item: PolicyItem) => (
              <button
                key={item.id}
                onClick={() => navigate(`/policies/${item.id}`)}
                className="flex items-center justify-between px-[16px] py-[16px] bg-white rounded-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow text-left"
              >
                <div className="flex flex-col gap-[4px]">
                  <span className="text-[16px] font-medium text-[#212121]">{item.title}</span>
                  <span className="text-[14px] text-[#6e6e6e]">Policy No: {item.id}</span>
                  {item.status && (
                    <span className={`text-[11px] font-medium px-[8px] py-[2px] rounded-full w-fit ${
                      item.status === 'In Force' || item.status === 'Active'
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : item.status === 'Expired' || item.status === 'Lapsed'
                        ? 'bg-[#fce4ec] text-[#c62828]'
                        : 'bg-[#fff8e1] text-[#e65100]'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-[20px] h-[20px] text-[#6e6e6e] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
        <span className="text-[14px] leading-[21px] text-white">Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</span>
        <span className="text-[14px] leading-[21px] text-white">All Rights Reserved.</span>
      </div>
    </div>
  );
}

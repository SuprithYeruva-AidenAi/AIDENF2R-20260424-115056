import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PanelLeft,
  HelpCircle,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  Gift,
  LayoutDashboard,
  Send,
  MessageSquare,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'How do I access the UOI Customer Portal?',
        answer: 'You can access the UOI Customer Portal by visiting our website and clicking on the "Login" button. Use your registered email address and password to sign in. If you are a new user, click "Create Account" to register.',
      },
      {
        question: 'How do I create a new account?',
        answer: 'To create a new account, click "Create Account" on the login page. You will need to provide your NRIC/FIN, date of birth, and email address. An OTP will be sent to your email for verification. Once verified, you can set your password and complete registration.',
      },
      {
        question: 'What can I do on the UOI Customer Portal?',
        answer: 'On the UOI Customer Portal, you can view and manage your insurance policies, submit and track claims, download policy documents, update your personal details, view payment history, and access exclusive rewards and partner offers.',
      },
    ],
  },
  {
    title: 'Claim',
    items: [
      {
        question: 'How do I submit a claim through the portal?',
        answer: 'To submit a claim, navigate to the "Claims" section from the sidebar and click "Submit Claim". Select the relevant policy, fill in the claim details, upload supporting documents, and click Submit. You will receive a confirmation email once your claim is received.',
      },
      {
        question: 'What documents do I need to submit a claim?',
        answer: 'Required documents vary by claim type. Generally, you will need: a completed claim form, proof of loss (e.g. police report, medical certificates), receipts or invoices for expenses claimed, and your policy document. Specific requirements will be shown during the claim submission process.',
      },
      {
        question: 'How long does it take to process my claim?',
        answer: 'Claim processing times vary depending on the type and complexity of the claim. Simple claims are typically processed within 5–7 business days. Complex claims may take up to 21 business days. You will be notified via email at each stage of the process.',
      },
      {
        question: 'Can I edit or withdraw a claim I\'ve already submitted?',
        answer: 'Once a claim has been submitted, you may be able to add additional documents or information. To withdraw a claim, please contact our claims team at claims@uoi.com.sg or call (+65) 6222 7733. Note that claims already under assessment may not be withdrawable.',
      },
    ],
  },
  {
    title: 'Policy Management',
    items: [
      {
        question: 'How do I view my active policies?',
        answer: 'Navigate to the "Policies" section from the sidebar to view all your active and past policies. You can filter by product type (Travel, Home, Motor, Helper) and click on any policy to view its full details.',
      },
      {
        question: "What does 'Not Covered' mean on a policy card?",
        answer: "'Not Covered' indicates that you do not currently have an active policy for that product category. You can click on the card to explore available plans and purchase coverage.",
      },
      {
        question: "What does 'Not Covered' mean on a policy card?",
        answer: "'Not Covered' indicates that you do not currently have an active policy for that product category. You can click on the card to explore available plans and purchase coverage.",
      },
      {
        question: 'How do I renew my policy?',
        answer: 'You will receive a renewal notice via email before your policy expires. You can also renew directly from the Policies page by clicking on the policy and selecting "Renew". Follow the prompts to review your coverage and complete payment.',
      },
      {
        question: 'Can I make changes to an existing policy?',
        answer: 'Certain changes (endorsements) can be made to an existing policy, such as updating insured details or coverage amounts. Navigate to the policy detail page and click "Edit" to request changes. Some changes may require underwriter approval.',
      },
      {
        question: 'How do I view my payment history for a policy?',
        answer: 'On the policy detail page, scroll down to the "Payment History" section to view all past premium payments, receipts, and upcoming payment schedules. You can download individual receipts as PDFs.',
      },
    ],
  },
  {
    title: 'Payment & Billing',
    items: [
      {
        question: 'Where can I view my upcoming premium payments?',
        answer: 'Your upcoming premium payments are shown on the Dashboard under each policy card. You can also view detailed payment schedules on the individual policy detail page under the "Billing" section.',
      },
      {
        question: 'My payment failed. What should I do?',
        answer: 'If your payment failed, please check that your payment details are up to date. You can retry the payment from the policy detail page. If the issue persists, contact us at (+65) 6222 7733 or contactus@uoi.com.sg for assistance.',
      },
      {
        question: 'How do I set up or cancel GIRO payments?',
        answer: 'To set up GIRO, download the GIRO application form from the portal, complete it, and submit it to your bank. To cancel GIRO, contact your bank directly or reach out to us at contactus@uoi.com.sg with your policy number.',
      },
    ],
  },
  {
    title: 'Account & Settings',
    items: [
      {
        question: 'How do I update my contact details?',
        answer: 'Navigate to "Settings" from the header profile menu. Under "Personal Information", you can update your mobile number, email address, and mailing address. Changes will take effect immediately after saving.',
      },
      {
        question: 'How do I close or deactivate my portal account?',
        answer: 'To close or deactivate your portal account, please contact our customer service team at contactus@uoi.com.sg or call (+65) 6222 7733. Note that closing your portal account does not cancel your insurance policies.',
      },
    ],
  },
];

const TOPIC_CARDS = [
  {
    title: 'Getting Started',
    description: 'Quick steps to help you begin using the portal.',
    section: 'Getting Started',
  },
  {
    title: 'Claim',
    description: 'Guidance on submitting, tracking, and managing claims.',
    section: 'Claim',
  },
  {
    title: 'Policy Management',
    description: 'Information on viewing, updating, and maintaining your policies.',
    section: 'Policy Management',
  },
  {
    title: 'Payments & Billing',
    description: 'Understand premiums, payments, and billing',
    section: 'Payment & Billing',
  },
  {
    title: 'Account & Settings',
    description: 'Help with login, personal details, and security settings.',
    section: 'Account & Settings',
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies' },
    { label: 'Claims', icon: Shield, path: '/claims' },
    { label: 'Rewards', icon: Gift, path: '/rewards' },
  ];

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToSection = (sectionTitle: string) => {
    const el = document.getElementById(`faq-section-${sectionTitle.replace(/\s+/g, '-')}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
            {/* Logo */}
            <div className="flex flex-col gap-[5px]">
              {sidebarOpen ? (
                <img
                  src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__"
                  alt="UOI Logo"
                  className="w-[50px] h-[25px] object-contain"
                />
              ) : (
                <div className="w-[24px] h-[25px]" />
              )}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-[12px]">
              {navItems.map(item => {
                const isActive = false;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center ${
                      sidebarOpen ? 'gap-[12px] px-[12px]' : 'justify-center px-[0px]'
                    } py-[10px] rounded-[8px] cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#005eb8]/10 to-[#5c55eb]/10 text-[#005eb8]'
                        : 'text-[#6e6e6e] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <item.icon className="w-[24px] h-[24px] shrink-0" />
                    {sidebarOpen && (
                      <span className="text-[16px] leading-[24px] text-[#212121] font-[Noto_Sans]">
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
          <main className="flex-1 overflow-y-auto">

            {/* Hero search section — white bg */}
            <div className="w-full bg-white px-[32px] py-[48px]">
              <div className="flex flex-col gap-[32px] w-full max-w-[980px] mx-auto">

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
                  <div className="flex items-center justify-center gap-[10px]">
                    <span className="text-[12px] font-bold leading-[16.8px] text-[#005eb8] font-[Noto_Sans]">Help &amp; Support</span>
                  </div>
                </div>

                {/* Title + search */}
                <div className="flex flex-col gap-[24px] flex-1">
                  <div className="flex flex-col gap-[8px]">
                    <h1 className="text-[32px] font-bold leading-[38.4px] text-[#212121] font-[Noto_Sans]">
                      Hi Chris, how can we help you today?
                    </h1>
                    <p className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">
                      Search our knowledge base for answers to common questions
                    </p>
                  </div>

                  {/* Search input */}
                  <div className="flex flex-col gap-[4px] w-full">
                    <div className="w-full rounded-[8px]">
                      <form onSubmit={handleSearch}>
                        <div className="flex items-center px-[16px] py-[0px] w-full h-[56px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]">
                          <div className="flex items-center gap-[12px] flex-1">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              placeholder="Ask anything..."
                              className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none placeholder:text-[#8d8d8d] font-[Noto_Sans]"
                            />
                            <button
                              type="submit"
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <Send className="w-[24px] h-[24px] text-[#005eb8]" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ content — gradient bg */}
            <div className="w-full bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07] px-[32px] py-[48px] pb-[0px]">
              <div className="flex flex-col gap-[48px] w-full max-w-[980px] mx-auto">

                {/* Topics section */}
                <div className="flex flex-col gap-[32px]">
                  <div className="flex items-center justify-between gap-[16px]">
                    <span className="text-[20px] font-bold leading-[24px] text-[#212121] font-[Noto_Sans]">Topics</span>
                  </div>

                  {/* Topic cards row 1 */}
                  <div className="flex flex-col gap-[20px]">
                    <div className="flex flex-row gap-[20px] flex-wrap">
                      {TOPIC_CARDS.slice(0, 3).map(topic => (
                        <button
                          key={topic.title}
                          onClick={() => scrollToSection(topic.section)}
                          className="flex flex-col p-[16px] gap-[24px] flex-1 min-w-[200px] bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow text-left"
                        >
                          <div className="flex flex-col gap-[12px]">
                            <ChevronUp className="w-[24px] h-[24px] text-[#6e6e6e]" />
                            <div className="flex flex-col gap-[4px]">
                              <span className="text-[16px] font-medium leading-[24px] text-[#212121] font-[Noto_Sans]">{topic.title}</span>
                              <span className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">{topic.description}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Topic cards row 2 */}
                    <div className="flex flex-row gap-[20px]">
                      {TOPIC_CARDS.slice(3, 5).map(topic => (
                        <button
                          key={topic.title}
                          onClick={() => scrollToSection(topic.section)}
                          className="flex flex-col p-[16px] gap-[24px] w-[313px] bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow text-left"
                        >
                          <div className="flex flex-col gap-[12px]">
                            <ChevronUp className="w-[24px] h-[24px] text-[#6e6e6e]" />
                            <div className="flex flex-col gap-[4px]">
                              <span className="text-[16px] font-medium leading-[24px] text-[#212121] font-[Noto_Sans]">{topic.title}</span>
                              <span className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans]">{topic.description}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ Sections */}
                {FAQ_SECTIONS.map(section => (
                  <div
                    key={section.title}
                    id={`faq-section-${section.title.replace(/\s+/g, '-')}`}
                    className="flex flex-col gap-[24px]"
                  >
                    {/* Section title */}
                    <div className="flex items-center justify-between gap-[16px]">
                      <span className="text-[18px] font-bold leading-[27px] text-[#212121] font-[Noto_Sans]">
                        {section.title}
                      </span>
                    </div>

                    {/* FAQ items */}
                    <div className="flex flex-col gap-[24px] w-full">
                      {section.items.map((item, idx) => {
                        const key = `${section.title}-${idx}`;
                        const isOpen = !!openItems[key];
                        return (
                          <div key={key} className="flex flex-col gap-[12px] w-full border-b border-[#000000]/[0.09] pb-[24px] last:border-0">
                            <button
                              onClick={() => toggleItem(key)}
                              className="flex items-center gap-[12px] w-full cursor-pointer text-left"
                            >
                              <span className="flex-1 text-[16px] font-medium leading-[24px] text-[#212121] font-[Noto_Sans]">
                                {item.question}
                              </span>
                              {isOpen
                                ? <ChevronUp className="w-[24px] h-[24px] text-[#6e6e6e] shrink-0" />
                                : <ChevronDown className="w-[24px] h-[24px] text-[#6e6e6e] shrink-0" />
                              }
                            </button>
                            {isOpen && (
                              <p className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans] pr-[36px]">
                                {item.answer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Still have questions card */}
                <div className="flex flex-col justify-center p-[24px] gap-[24px] w-full bg-white rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col gap-[12px] w-full">
                    <div className="flex items-center gap-[12px]">
                      <MessageSquare className="w-[24px] h-[24px] text-[#005eb8]" />
                      <span className="text-[20px] font-bold leading-[24px] text-[#212121] font-[Noto_Sans]">Still have questions?</span>
                    </div>
                    <p className="text-[14px] leading-[21px] text-[#6e6e6e] font-[Noto_Sans] whitespace-pre-line">
                      {'Phone: (+65) 6222 7733  |  Email: contactus@uoi.com.sg  |  24Hr Emergency: (+65) 6222 7737\nOffice hours: Mon\u2013Thu 8.45am\u20135.45pm, Fri 8.45am\u20134.45pm. Closed on weekends and public holidays.'}
                    </p>
                  </div>
                </div>

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

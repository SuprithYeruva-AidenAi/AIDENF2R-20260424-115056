import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

type Step = 'nric' | 'otp' | 'password';

export default function CreateAccount() {
  const navigate = useNavigate();

  // Step
  const [step, setStep] = useState<Step>('nric');

  // Step 1 fields
  const [nric, setNric] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtpToast, setShowOtpToast] = useState(false);

  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const passwordChecks = {
    length: password.length >= 8,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    numberSymbol: /[0-9!@#$%^&*]/.test(password),
  };
  const allChecked = passwordChecks.length && passwordChecks.upperLower && passwordChecks.numberSymbol;

  const handleGetOtp = () => {
    if (!email.includes('@')) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');
    setOtpSent(true);
    setShowOtpToast(true);
    setTimeout(() => setShowOtpToast(false), 3000);
  };

  const handleNextStep1 = () => {
    if (!email.includes('@')) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');
    if (otpSent) {
      setStep('otp');
    } else {
      handleGetOtp();
    }
  };

  const handleNextStep2 = () => {
    setOtpError('');
    setStep('password');
  };

  const handleCreateAccount = () => {
    let hasError = false;
    if (!allChecked) {
      setPasswordError('Password must be at least 8 characters and include letters and numbers.');
      hasError = true;
    } else {
      setPasswordError('');
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Password do not match, try again.');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }
    if (hasError) return;
    setTimeout(() => navigate('/dashboard'), 800);
  };

  const formBg = 'bg-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.56)_0%,_rgba(255,255,255,0.08)_100%)]';

  return (
    <div className="min-h-screen w-full flex flex-col font-[Noto_Sans] overflow-hidden">
      {/* OTP Toast */}
      {showOtpToast && (
        <div className="fixed top-[24px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-[8px] px-[16px] py-[8px] bg-[#d8ffe2] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="w-[16px] h-[16px] rounded-full bg-green-500 flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[14px] leading-[21px] text-[#212121]">OTP sent to email address.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left panel */}
        <div className="flex-1 flex flex-col items-center justify-center py-[40px] px-[24px] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">

          {/* STEP 1: NRIC Form */}
          {step === 'nric' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                {/* Header */}
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Create Account</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Check that information you provide is accurate before proceeding.</p>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-[16px] w-full">
                  {/* NRIC */}
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">NRIC/FIN</label>
                    <input
                      type="text"
                      value={nric}
                      onChange={e => setNric(e.target.value)}
                      className="w-full h-[48px] px-[16px] py-[12px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] leading-[24px] text-[#212121] outline-none focus:border-[#005eb8]"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="w-full h-[48px] px-[16px] py-[12px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] leading-[24px] text-[#212121] outline-none focus:border-[#005eb8] pr-[48px]"
                      />
                      <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8d8d8d" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Email Address</label>
                    <div className="flex items-center gap-[8px] w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]" style={emailError ? {borderColor:'#dc3545'} : {}}>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                        className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none"
                      />
                      {email && !emailError && (
                        <button
                          onClick={handleGetOtp}
                          className="shrink-0 h-[32px] px-[16px] bg-white rounded-[8px] border border-[#005eb8] text-[14px] font-medium text-[#005eb8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                        >
                          {otpSent ? 'Resend' : 'Get OTP'}
                        </button>
                      )}
                    </div>
                    {emailError && (
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">!</span>
                        </div>
                        <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{emailError}</span>
                      </div>
                    )}
                  </div>

                  {/* OTP field shown after OTP sent */}
                  {otpSent && (
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex items-center w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]" style={otpError ? {borderColor:'#dc3545'} : {}}>
                        <input
                          type="text"
                          value={otp}
                          onChange={e => { setOtp(e.target.value); setOtpError(''); }}
                          placeholder="Enter code"
                          className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none placeholder:text-[#8d8d8d]"
                        />
                      </div>
                      {otpError && (
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-bold">!</span>
                          </div>
                          <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{otpError}</span>
                        </div>
                      )}
                      <span className="text-[14px] leading-[21px] text-[#0d6efd] cursor-pointer" onClick={handleGetOtp}>Didn't receive a code? Resend</span>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextStep1}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium leading-[24px] text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>

              {/* Below card links */}
              <div className="flex flex-col gap-[12px] w-full max-w-[420px] mt-[24px]">
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  Already have an account?{' '}
                  <span className="text-[#005eb8] cursor-pointer underline" onClick={() => navigate('/login')}>Log in</span>
                </p>
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  If you're experiencing login issues, please contact us at{' '}
                  <a href="mailto:help@uoi.com.sg" className="text-[#005eb8]">help@uoi.com.sg.</a>
                </p>
              </div>
            </>
          )}

          {/* STEP 2: OTP Verification (standalone) */}
          {step === 'otp' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Create Account</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Check that information you provide is accurate before proceeding.</p>
                </div>
                <div className="flex flex-col gap-[16px] w-full">
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">NRIC/FIN</label>
                    <div className="w-full h-[48px] px-[16px] flex items-center bg-white rounded-[8px] border border-[#000000]/[0.09]">
                      <span className="text-[16px] leading-[24px] text-[#212121]">{nric}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Email Address</label>
                    <div className="w-full h-[48px] px-[16px] flex items-center bg-white rounded-[8px] border border-[#000000]/[0.09]">
                      <span className="text-[16px] leading-[24px] text-[#212121]">{email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]" style={otpError ? {borderColor:'#dc3545'} : {}}>
                      <input
                        type="text"
                        value={otp}
                        onChange={e => { setOtp(e.target.value); setOtpError(''); }}
                        placeholder="Enter code"
                        className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none placeholder:text-[#8d8d8d]"
                      />
                    </div>
                    {otpError && (
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">!</span>
                        </div>
                        <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{otpError}</span>
                      </div>
                    )}
                    <span className="text-[14px] leading-[21px] text-[#0d6efd] cursor-pointer" onClick={() => { setShowOtpToast(true); setTimeout(() => setShowOtpToast(false), 3000); }}>Didn't receive a code? Resend</span>
                  </div>
                </div>
                <button
                  onClick={handleNextStep2}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium leading-[24px] text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>
              <div className="flex flex-col gap-[12px] w-full max-w-[420px] mt-[24px]">
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  Already have an account?{' '}
                  <span className="text-[#005eb8] cursor-pointer underline" onClick={() => navigate('/login')}>Log in</span>
                </p>
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  If you're experiencing login issues, please contact us at{' '}
                  <a href="mailto:help@uoi.com.sg" className="text-[#005eb8]">help@uoi.com.sg.</a>
                </p>
              </div>
            </>
          )}

          {/* STEP 3: Set Password */}
          {step === 'password' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                {/* Back */}
                <button
                  onClick={() => setStep('otp')}
                  className="flex items-center gap-[4px] w-full cursor-pointer"
                >
                  <ChevronLeft className="w-[20px] h-[20px] text-[#6e6e6e]" />
                  <span className="text-[14px] leading-[21px] text-[#6e6e6e]">Back</span>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Set Password</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Enter a password for your new account.</p>
                </div>

                <div className="flex flex-col gap-[32px] w-full">
                  <div className="flex flex-col gap-[16px] w-full">
                    {/* Password field */}
                    <div className="flex flex-col gap-[12px]">
                      <label className="text-[14px] leading-[21px] text-[#212121]">Password</label>
                      <div
                        className="flex items-center justify-between w-full h-[48px] px-[16px] bg-white rounded-[8px] border focus-within:border-[#005eb8]"
                        style={passwordError ? {borderColor:'#dc3545'} : {borderColor:'rgba(0,0,0,0.09)'}}
                      >
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                          className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none"
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="ml-[8px] cursor-pointer">
                          {showPassword ? <EyeOff className="w-[24px] h-[24px] text-[#8d8d8d]" /> : <Eye className="w-[24px] h-[24px] text-[#8d8d8d]" />}
                        </button>
                      </div>
                      {passwordError && (
                        <div className="flex items-start gap-[8px]">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0 mt-[1px]">
                            <span className="text-white text-[10px] font-bold">!</span>
                          </div>
                          <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{passwordError}</span>
                        </div>
                      )}
                      {/* Password requirements */}
                      <div className="flex flex-col gap-[8px]">
                        <p className="text-[12px] leading-[16.8px] text-[#6e6e6e]">Your password must contain at least:</p>
                        {[
                          { key: 'length', label: '8 characters', met: passwordChecks.length },
                          { key: 'upperLower', label: '1 uppercase and lowercase letter', met: passwordChecks.upperLower },
                          { key: 'numberSymbol', label: '1 number or symbol (e.g. !, @, #)', met: passwordChecks.numberSymbol },
                        ].map(item => (
                          <div key={item.key} className="flex items-center gap-[8px]">
                            {item.met ? (
                              <div className="w-[16px] h-[16px] rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                            ) : (
                              <div className="w-[16px] h-[16px] rounded-full border border-[#8d8d8d] shrink-0" />
                            )}
                            <span className="text-[12px] leading-[16.8px] text-[#6e6e6e]">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-[12px]">
                      <label className="text-[14px] leading-[21px] text-[#212121]">Confirm Password</label>
                      <div
                        className="flex items-center justify-between w-full h-[48px] px-[16px] bg-white rounded-[8px] border focus-within:border-[#005eb8]"
                        style={confirmPasswordError ? {borderColor:'#dc3545'} : {borderColor:'rgba(0,0,0,0.09)'}}
                      >
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                          className="flex-1 bg-transparent text-[16px] leading-[24px] text-[#212121] outline-none"
                        />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="ml-[8px] cursor-pointer">
                          {showConfirmPassword ? <EyeOff className="w-[24px] h-[24px] text-[#8d8d8d]" /> : <Eye className="w-[24px] h-[24px] text-[#8d8d8d]" />}
                        </button>
                      </div>
                      {confirmPasswordError && (
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-bold">!</span>
                          </div>
                          <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{confirmPasswordError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateAccount}
                    className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium leading-[24px] text-white cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] w-full max-w-[420px] mt-[24px]">
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  Already have an account?{' '}
                  <span className="text-[#005eb8] cursor-pointer underline" onClick={() => navigate('/login')}>Log in</span>
                </p>
                <p className="text-[14px] leading-[21px] text-[#6e6e6e] text-center">
                  If you're experiencing login issues, please contact us at{' '}
                  <a href="mailto:help@uoi.com.sg" className="text-[#005eb8]">help@uoi.com.sg.</a>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right panel — hero image */}
        <div className="hidden md:block md:flex-1 relative">
          <img src="https://s3-alpha-sig.figma.com/img/aab6/0921/4d0afc4bf990cf584c0c3c3e94ab342d?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=evV6xk8x8mXwhl5DIkzHg2YvXWJLdjUEE4QzPiw6skwI8IIpjBvimdVwPWI3lvrYlZLeVrGLuFRhJSyQ4GLkoIysQRqfpOJ8dmtuYTF0s9CS2fmpshgKg~eT~~cvuqARWBTTgJbpm4EKFFQe~kRYW2YGiRqEXepHLEst6q0xBDgHIiQabxEZE9VchjDafhutP34bXOqxyem451w8M82FG1pcJ~uI8MojTj-DkPpVSG9U6c-dXDkuPq2ZLzeGBzySFlIhRmWkDUzHDYlXHEUa6ro4WFSx71OMT6F2uglnWSRUKZQXRbtGsylqIereApngRcCLus72riI1Hx4ANuxYcA__" alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
        <span className="text-[14px] leading-[21px] text-white text-center md:text-left">Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</span>
        <span className="text-[14px] leading-[21px] text-white text-center md:text-right">All Rights Reserved.</span>
      </div>
    </div>
  );
}

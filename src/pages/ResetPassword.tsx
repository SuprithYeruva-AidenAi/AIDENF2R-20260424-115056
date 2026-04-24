import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

type ResetStep = 'login-error' | 'new-device-otp' | 'forgot-password' | 'reset-password';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>('new-device-otp');

  // Login error state (1.4 Reset Password)
  const [loginNric, setLoginNric] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginPasswordError, setLoginPasswordError] = useState('');

  // New device OTP
  const [deviceOtp, setDeviceOtp] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [showEmailSentToast, setShowEmailSentToast] = useState(false);

  // Reset password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showPasswordUpdatedToast, setShowPasswordUpdatedToast] = useState(false);

  const handleVerifyOtp = () => {
    setTimeout(() => navigate('/dashboard'), 500);
  };

  const handleSendEmail = () => {
    setShowEmailSentToast(true);
    setTimeout(() => {
      setShowEmailSentToast(false);
      setStep('login-error');
    }, 2500);
  };

  const handleConfirmReset = () => {
    setShowPasswordUpdatedToast(true);
    setTimeout(() => {
      setShowPasswordUpdatedToast(false);
      navigate('/login');
    }, 2500);
  };

  const formBg = 'bg-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.56)_0%,_rgba(255,255,255,0.08)_100%)]';

  return (
    <div className="min-h-screen w-full flex flex-col font-[Noto_Sans] overflow-hidden">
      {/* Toasts */}
      {showEmailSentToast && (
        <div className="fixed top-[24px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-[8px] px-[16px] py-[8px] bg-[#d8ffe2] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="w-[16px] h-[16px] rounded-full bg-green-500 flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[14px] leading-[21px] text-[#212121]">Password reset email sent.</span>
        </div>
      )}
      {showPasswordUpdatedToast && (
        <div className="fixed top-[24px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-[8px] px-[16px] py-[8px] bg-[#d8ffe2] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="w-[16px] h-[16px] rounded-full bg-green-500 flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[14px] leading-[21px] text-[#212121]">Password updated successfully.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left panel */}
        <div className="flex-1 flex flex-col items-center justify-center py-[40px] px-[24px] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">

          {/* STATE: Login with wrong password (1.4 Reset Password) */}
          {step === 'login-error' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Welcome to UOI Customer Portal</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Manage all your policies in one portal.</p>
                </div>
                <div className="flex flex-col gap-[16px] w-full">
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">NRIC/FIN</label>
                    <input
                      type="text"
                      value={loginNric}
                      onChange={e => setLoginNric(e.target.value)}
                      className="w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] text-[#212121] outline-none focus:border-[#005eb8]"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-[12px]">
                      <label className="text-[14px] leading-[21px] text-[#212121]">Password</label>
                      <div
                        className="flex items-center justify-between w-full h-[48px] px-[16px] bg-white rounded-[8px] border"
                        style={loginPasswordError ? {borderColor:'#dc3545'} : {borderColor:'rgba(0,0,0,0.09)'}}
                      >
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={e => { setLoginPassword(e.target.value); setLoginPasswordError(''); }}
                          className="flex-1 bg-transparent text-[16px] text-[#212121] outline-none"
                        />
                        <button onClick={() => setShowLoginPassword(!showLoginPassword)} className="ml-[8px] cursor-pointer">
                          {showLoginPassword ? <EyeOff className="w-[24px] h-[24px] text-[#8d8d8d]" /> : <Eye className="w-[24px] h-[24px] text-[#8d8d8d]" />}
                        </button>
                      </div>
                    </div>
                    {loginPasswordError && (
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">!</span>
                        </div>
                        <span className="text-[12px] leading-[16.8px] text-[#dc3545]">Wrong password</span>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-[14px] leading-[21px] text-[#6e6e6e] cursor-pointer underline w-fit"
                    onClick={() => setStep('forgot-password')}
                  >
                    Forgot password?
                  </span>
                </div>
                <button
                  onClick={() => { setLoginPasswordError('Wrong password'); }}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
              </div>
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
            </>
          )}

          {/* STATE: New device OTP */}
          {step === 'new-device-otp' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Logging in on a new device?</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">
                    We've sent a one-time password (OTP) to{' '}
                    <br />ch****@gmail.com
                  </p>
                </div>
                <div className="flex flex-col gap-[16px] w-full">
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Enter Code</label>
                    <input
                      type="text"
                      value={deviceOtp}
                      onChange={e => setDeviceOtp(e.target.value)}
                      className="w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] text-[#212121] outline-none focus:border-[#005eb8]"
                    />
                  </div>
                  <span className="text-[14px] leading-[21px] text-[#6e6e6e]">
                    Didn't receive a code?{' '}
                    <span className="text-[#0d6efd] cursor-pointer">Resend</span>
                  </span>
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Verify
                </button>
              </div>
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
            </>
          )}

          {/* STATE: Forgot Password */}
          {step === 'forgot-password' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                <button
                  onClick={() => setStep('login-error')}
                  className="flex items-center gap-[4px] w-full cursor-pointer"
                >
                  <ChevronLeft className="w-[20px] h-[20px] text-[#6e6e6e]" />
                  <span className="text-[14px] leading-[21px] text-[#6e6e6e]">Back</span>
                </button>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Forgot Password</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Enter your account's email address and we'll send you an email to reset password</p>
                </div>
                <div className="flex flex-col gap-[12px] w-full">
                  <label className="text-[14px] leading-[21px] text-[#212121]">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] text-[16px] text-[#212121] outline-none focus:border-[#005eb8]"
                  />
                </div>
                <button
                  onClick={handleSendEmail}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Send Email
                </button>
              </div>
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
            </>
          )}

          {/* STATE: Reset Password (set new password) */}
          {step === 'reset-password' && (
            <>
              <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-[4px] w-full cursor-pointer"
                >
                  <ChevronLeft className="w-[20px] h-[20px] text-[#6e6e6e]" />
                  <span className="text-[14px] leading-[21px] text-[#6e6e6e]">Back to Login</span>
                </button>
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
                  <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Reset Password</p>
                  <p className="text-[16px] leading-[24px] text-[#212121] text-center">Check that information you provide is accurate before proceeding.</p>
                </div>
                <div className="flex flex-col gap-[16px] w-full">
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Password</label>
                    <div className="flex items-center justify-between w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="flex-1 bg-transparent text-[16px] text-[#212121] outline-none"
                      />
                      <button onClick={() => setShowNewPassword(!showNewPassword)} className="ml-[8px] cursor-pointer">
                        {showNewPassword ? <EyeOff className="w-[24px] h-[24px] text-[#8d8d8d]" /> : <Eye className="w-[24px] h-[24px] text-[#8d8d8d]" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <label className="text-[14px] leading-[21px] text-[#212121]">Confirm Password</label>
                    <div className="flex items-center justify-between w-full h-[48px] px-[16px] bg-white rounded-[8px] border border-[#000000]/[0.09] focus-within:border-[#005eb8]">
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        className="flex-1 bg-transparent text-[16px] text-[#212121] outline-none"
                      />
                      <button onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="ml-[8px] cursor-pointer">
                        {showConfirmNewPassword ? <EyeOff className="w-[24px] h-[24px] text-[#8d8d8d]" /> : <Eye className="w-[24px] h-[24px] text-[#8d8d8d]" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleConfirmReset}
                  className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Confirm
                </button>
              </div>
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
            </>
          )}
        </div>

        {/* Right panel */}
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

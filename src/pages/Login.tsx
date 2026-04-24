import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [nric, setNric] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    setPasswordError('');
    setTimeout(() => navigate('/dashboard'), 500);
  };

  const formBg = 'bg-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.56)_0%,_rgba(255,255,255,0.08)_100%)]';

  return (
    <div className="min-h-screen w-full flex flex-col font-[Noto_Sans] overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left panel */}
        <div className="flex-1 flex flex-col items-center justify-center py-[40px] px-[24px] bg-white bg-gradient-to-b from-[#005eb8]/[0.07] to-[#5c55eb]/[0.07]">
          <div className={`w-full max-w-[420px] flex flex-col items-center gap-[32px] py-[32px] px-[24px] ${formBg} rounded-[24px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]`}>
            {/* Header */}
            <div className="flex flex-col items-center gap-[12px] w-full">
              <img src="https://s3-alpha-sig.figma.com/img/26ec/3ab4/0588c7482da725dcdeb68b2897f9bde2?Expires=1777852800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShoM0pDLFtIglvPWeRLcrNHkP-8DajZ~UfTydATZnIyvxRx0Q8vNaKu-xBitsol0veqqwq1r4p1azXwhatXwj7sKArxvuNthVWmFirx22koohe8997mFNM6GF2P9FJZQ6hnguVRCcCTWizRFgiWWnqabTviIJl1EuaMxA65dwinn4u47OVQuKOW4HPfBJ49i-x-lqHrsAbGLy9XfBAQqpYzMCSsmnWFH-jgrpSRysU3HqoilRLqyQb6LtiIX7mix4qKeTiJI50ywXWQYf5zHXGyqc7Ry5JQaJUdS88v~1e1Kd-i6t7RipipnfhyJG71UbhW-m-9vh~8Pv9t2nKWPxg__" alt="UOI Logo" className="w-[100px] h-[50px] object-contain" />
              <p className="text-[32px] font-bold leading-[38.4px] text-[#212121] text-center">Welcome to UOI Customer Portal</p>
              <p className="text-[16px] leading-[24px] text-[#212121] text-center">Manage all your policies in one portal.</p>
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

              {/* Password */}
              <div className="flex flex-col gap-[8px]">
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
                </div>
                {passwordError && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#dc3545] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">!</span>
                    </div>
                    <span className="text-[12px] leading-[16.8px] text-[#dc3545]">{passwordError}</span>
                  </div>
                )}
              </div>

              {/* Forgot password */}
              <span
                className="text-[14px] leading-[21px] text-[#6e6e6e] cursor-pointer underline w-fit"
                onClick={() => navigate('/reset-password')}
              >
                Forgot password?
              </span>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-[14px] px-[40px] bg-[#005eb8] rounded-[8px] text-[16px] font-medium leading-[24px] text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              Login
            </button>
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

      {/* Footer */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-[24px] py-[16px] bg-[#005eb8] gap-[8px]">
        <span className="text-[14px] leading-[21px] text-white text-center md:text-left">Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</span>
        <span className="text-[14px] leading-[21px] text-white text-center md:text-right">All Rights Reserved.</span>
      </div>
    </div>
  );
}

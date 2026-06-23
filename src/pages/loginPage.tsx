import { images } from "../api/constant/images"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-base-100 p-6 sm:p-12">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-24 w-full max-w-6xl">
        
        <div className="flex flex-col gap-8 w-full max-w-md">
          <div className="flex justify-start">
            <img src={images.loginPageLogo} alt="Shafmet logo" className="w-60" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-base-content tracking-tight">Login Bo'limi</h1>
            <p className="text-base-content/60 mt-3 text-sm leading-relaxed">
              Siz login qilishingiz uchun admin bo'lishingiz va sizda maxsus kod bo'lishi kerak.
            </p>
          </div>

          <form className="flex flex-col gap-6 w-full">
            <div className="relative w-full">
              <input
                type="tel"
                className="w-full bg-transparent border border-base-300 rounded-lg px-4 py-3.5 outline-none focus:border-blue-600 transition-colors tabular-nums text-sm animate-none"
                required
                placeholder="+998 90 555 20 33"
                pattern="[0-9]*"
                minLength={9}
                maxLength={13}
              />
              <span className="absolute -top-2 left-3 bg-white z-10 px-1.5 text-xs font-medium text-base-content/60 pointer-events-none">
                Telefon Raqamingiz
              </span>
            </div>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent border border-base-300 rounded-lg pl-4 pr-12 py-3.5 outline-none focus:border-blue-600 transition-colors text-sm"
                required
                placeholder="************"
                minLength={6}
              />
              <span className="absolute -top-2 left-3 bg-white z-10 px-1.5 text-xs font-medium text-base-content/60 pointer-events-none">
                Parolingiz
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors z-20"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm">
              Submit
            </button>
          </form>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-gray-100 rounded-[2.5rem] p-16 w-full max-w-xl aspect-square">
          <img src={images.LoginPageImage} alt="Login illustration" className="w-full max-w-xs object-contain" />
        </div>

      </div>
    </section>
  )
}

export default LoginPage;
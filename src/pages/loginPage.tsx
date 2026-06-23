import { images } from "../api/constant/images"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-base-100 px-6 sm:px-12">

      {/* Katta Card */}
      <div
        className="flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl overflow-hidden bg-white"
        style={{
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        }}
      >

        {/* Form */}
        <div className="w-full lg:w-120 shrink-0 px-10 py-14">
          <img
            src={images.loginPageLogo}
            alt="Shafmet logo"
            className="w-52 mb-7"
          />

          <h1 className="text-4xl font-bold mb-3">
            Login Bo'limi
          </h1>

          <p className="text-sm text-gray-900 leading-relaxed mb-7">
            Siz login qilishingiz uchun admin bo'lishingiz va sizda maxsus kod
            bo'lishi kerak.
          </p>

          <form className="space-y-5">

            {/* Telefon */}
            <div className="relative">
              <label
                htmlFor="phone"
                className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-800 z-10"
              >
                Telefon Raqamingiz
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+998 90 555 20 33"
                className="w-full h-13 border border-gray-400 rounded px-4 text-sm outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Parol */}
            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-800 z-10"
              >
                Parolingiz
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                className="w-full h-13 border border-gray-400 rounded px-4 pr-12 text-sm outline-none focus:border-blue-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
            >
              Submit
            </button>

          </form>
        </div>

        {/* Rasm */}
        <div className="hidden lg:flex items-center justify-center flex-1 bg-blue-50 p-8">
          <img
            src={images.LoginPageImage}
            alt="Login illustration"
            className="w-full max-h-125 object-contain"
          />
        </div>

      </div>

    </section>
  )
}

export default LoginPage
import { images } from "../api/constant/images"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-base-100 px-6 sm:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 w-full max-w-6xl">

        {/* Form */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <div>
            <img
              src={images.loginPageLogo}
              alt="Shafmet logo"
              className="w-60"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Login Bo'limi
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-base-content/60">
              Siz login qilishingiz uchun admin bo'lishingiz va sizda maxsus kod
              bo'lishi kerak.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            {/* Telefon */}
            <div className="w-full">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                Telefon Raqamingiz
              </label>

              <input
                id="phone"
                type="tel"
                placeholder="+998 90 555 20 33"
                className="w-full border-2 border-blue-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-700 transition-colors"
              />
            </div>

            {/* Parol */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                Parolingiz
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  className="w-full border-2 border-blue-500 rounded-2xl pl-4 pr-12 py-3 outline-none focus:border-blue-700 transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-2xl transition-colors"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Rasm */}
        <div className="hidden lg:flex items-center justify-center w-full max-w-xl">
          <img
            src={images.LoginPageImage}
            alt="Login illustration"
            className="w-full object-contain"
          />
        </div>

      </div>
    </section>
  )
}

export default LoginPage
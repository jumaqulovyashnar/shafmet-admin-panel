import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserToken {
    accessToken: string
    refreshToken?: string
}

interface UserInfo {
    id?: number | string
    phone?: string
    name?: string
}

interface UserState {
    userInfo: UserInfo | null
    userToken: UserToken | null
    actions: {
        setUserInfo: (info: UserInfo) => void
        setUserToken: (token: UserToken) => void
        clearUserInfoAndToken: () => void
    }
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userInfo: null,
            userToken: null,
            actions: {
                setUserInfo: (info) => set({ userInfo: info }),
                setUserToken: (token) => set({ userToken: token }),
                clearUserInfoAndToken: () =>
                    set({ userInfo: null, userToken: null }),
            },
        }),
        {
            name: 'shafmet_user',
            partialize: (state) => ({
                userInfo: state.userInfo,
                userToken: state.userToken,
            }),
        }
    )
)

export default useUserStore

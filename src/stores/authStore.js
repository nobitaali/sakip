import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      permissions: [],
      
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          permissions: userData.permissions || []
        })
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          permissions: []
        })
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }))
      },
      
      hasPermission: (permission) => {
        const { permissions, user } = get()
        if (user?.role === 'super_admin') return true
        return permissions.includes(permission)
      },
      
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      }
    }),
    {
      name: 'sakip-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      })
    }
  )
)
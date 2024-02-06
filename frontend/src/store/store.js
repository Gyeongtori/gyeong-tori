import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create(set => ({
  islogined: localStorage.accessToken ? true : false,
  setIslogind: (logined) => set({ islogined: logined}),
  user : null,
  
  fetchUser: async () => {
    if(!localStorage.accessToken) {
      console.log('로그인되지 않음')
      return
    }
    // try {
    //   const response = await axios.get(`/v1/auth/login`, {
    //     headers: {
    //       'Authorization' : `Bearer ${localStorage.accessToken}`
    //     }
    //   })
    //   set({user: response.data})
    // } catch(error) {
    //   console.log(error)
    // }
  },
  
}))


import { create } from 'zustand'
import axios from "axios";


const useStore = create(set => ({
  // user: {},
  // setUser: (userInfo) => set({ user: userInfo }),

  // 유저정보 저장
  user: JSON.parse(localStorage.getItem('user')) || {},
  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 토큰 업데이트
  updateToken: async () => {
    try {
      const res = await axios.get('/v1/auth/refresh');
      if (res.response.status === 204 ) {
        return res
      }
    } catch (error) {
      console.log('Error refreshing token:', error);
    }
  }
  
}))

export default useStore;
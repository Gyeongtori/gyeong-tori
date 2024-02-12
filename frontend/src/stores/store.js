import { create } from 'zustand'
import axios from "axios";
import Cookies from 'js-cookie';

const accessToken = Cookies.get('accessToken')
const refreshToken = Cookies.get('refreshToken')

const useStore = create(set => ({
  user: {},
  setUser: (userInfo) => set({ user: userInfo }),


  // 토큰 재발급
  // accessToken: Cookies.get('accessToken'),
  // refreshToken: Cookies.get('refreshToken'),

  updateToken: async () => {
    try {
      const res = await axios.get('/v1/auth/refresh', {
        refresh_token: refreshToken
      });
      if (res.response.status === 500 ) {
        const newToken = res.data.data_body.access_token;
        Cookies.set('accessToken', newToken);
        set({ token: newToken });
      }
    } catch (error) {
      console.log('Error refreshing token:', error);
    }
  }
  
}))

export default useStore;
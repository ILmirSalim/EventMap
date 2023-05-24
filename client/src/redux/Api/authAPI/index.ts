import axios from 'axios';

interface LoginResponse {
      accessToken: string;
      refreshToken: string;
      user: {
        email: string;
        id: string;
      };
    }
export const authAPI = {
      async authUser(email: string, password: string): Promise<LoginResponse> {
        try {
          const response = await axios.post('http://localhost:3002/api/login', { email, password });
          localStorage.setItem('token', response.data.refreshToken);
          return response.data;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    }


// export const authAPI = {
//     async authUser(email: string, password: string) {
//         try {
//             const response = await axios.post('http://localhost:3002/api/login', {
//                 email,
//                 password,
//             });
//             localStorage.setItem('token', response.data.refreshToken);
//             return response.data;
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }
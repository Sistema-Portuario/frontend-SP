export const authInitialState = {
  token: '',

  user: {
    name: '',
    password: '',
    email: '',
    role: 'admin',
    position: '',
  },

  authenticate: true,
  authenticating: false,
  loading: false,
  error: '',
  message: '',
};
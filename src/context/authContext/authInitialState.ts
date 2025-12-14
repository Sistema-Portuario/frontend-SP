export const authInitialState = {
  token: '',

  user: {
    name: '',
    password: '',
    email: '',
    role: 'employee',
    position: '',
  },

  authenticate: true,
  authenticating: false,
  loading: false,
  error: '',
  message: '',
};
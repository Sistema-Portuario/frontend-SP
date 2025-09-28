export const authInitialState = {
  token: '',

  user: {
    name: '',
    password: '',
    email: '',
    role: '',
    position: [],
  },

  authenticate: false,
  authenticating: false,
  loading: false,
  error: '',
  message: '',
};
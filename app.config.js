// Extends app.json. When building for GitHub Pages (a project site served from
// a subpath), set EXPO_PUBLIC_PAGES=1 so web assets resolve under /EXPO-APP.
const base = require('./app.json');

module.exports = () => {
  const config = { ...base.expo };
  if (process.env.EXPO_PUBLIC_PAGES === '1') {
    config.experiments = { ...(config.experiments || {}), baseUrl: '/EXPO-APP' };
  }
  return config;
};

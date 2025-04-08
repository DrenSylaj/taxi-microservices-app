import Cookies from "js-cookie";

export const getAccessToken = () => Cookies.get("access_token");
export const getRefreshToken = () => Cookies.get("refresh_token");
export const isAuthenticated = () => !!getAccessToken();

// "A" === true
// !"A" === false
// !!"A" === true
// null || undefined === false

const redirectToLogin = () => {
  window.location.replace(
    `${getConfig().LOGIN_URL}?next=${window.location.href}`
  );
};

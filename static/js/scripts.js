let auth0 = null;
const fetchAuthConfig = () => fetch("./js/auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
    updateUI();
  }

  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    console.log('authenticated')
  } else {
    console.log('unauthenticated')
    //login();
  }
}

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  //document.getElementById("btn-logout").disabled = !isAuthenticated;
  //document.getElementById("btn-login").disabled = isAuthenticated;
  document.getElementById("btn-logout").disabled = false;
  document.getElementById("btn-login").disabled = false;
};

const login = async () => {
  console.log('click')
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin
  });
};

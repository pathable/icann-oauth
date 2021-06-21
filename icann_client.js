Icann = {};

Icann.requestCredential = (options, credentialRequestCompleteCallback) => {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    // eslint-disable-next-line no-param-reassign
    credentialRequestCompleteCallback = options;
    // eslint-disable-next-line no-param-reassign
    options = {};
  }

  const config = options.config;
  const credentialToken = Random.secret();
  const loginStyle = 'redirect';

  const loginUrlParameters = {
    client_id: config.clientId,
    redirect_uri: OAuth._redirectUri('icann', config),
    // response_type: 'code',
    // scope: config.scopes,
    state: OAuth._stateParam(
      loginStyle,
      credentialToken,
      options && options.redirectUrl,
      { communityId: config.communityId }
    ),
    response_mode: 'form_post',
  };

  const loginUrl =
    config.authorizationUrl +
    '?' +
    Object.keys(loginUrlParameters)
      .map(
        param =>
          `${encodeURIComponent(param)}=${encodeURIComponent(
            loginUrlParameters[param]
          )}`
      )
      .join('&');

  OAuth.launchLogin({
    loginService: 'icann',
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
  });
};

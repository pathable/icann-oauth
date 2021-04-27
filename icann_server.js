Icann = {};

Icann.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);

OAuth.registerService('icann', 2, null, query => {
  const config = Icann.getConfiguration({ tenantId: query.tenantId });

  const { access_token: accessToken, id_token: idToken } = query;

  const {
    sub: id,
    email,
    given_name: firstName,
    family_name: lastName,
    name,
  } = handleUserInfo(idToken, accessToken, config);

  const emailsFormatted = email ? [email] : [];

  const serviceData = {
    id,
    firstName: firstName || name,
    lastName,
    email,
    accessToken,
  };

  const options = {
    profile: { firstName: firstName || name, lastName },
    tenantId: query.tenantId,
    email: email,
    emails: emailsFormatted,
  };

  return {
    serviceName: 'icann',
    serviceData,
    options,
  };
});

const handleUserInfo = (idToken, accessToken, { userInfoUrl }) => {
  if (!userInfoUrl) {
    return userDataFromToken(idToken);
  }
  try {
    const { data } = HTTP.get(userInfoUrl, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    return data;
  } catch (error) {
    console.error(`[icann-server] Error to retrieve user info`, {
      error,
      userInfoUrl,
    });
  }
};

const userDataFromToken = idToken => {
  if (idToken) {
    try {
      const tokenParts = idToken.split('.');
      return JSON.parse(
        new Buffer.from(tokenParts[1], 'base64').toString()
      );
    } catch (error) {
      console.error(`[icann-server] Error to retrieve user info`, {
        error,
        idToken,
      });
    }
  }
};

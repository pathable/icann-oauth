Icann = {};

Icann.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);

OAuth.registerService('icann', 2, null, query => {
  const config = Icann.getConfiguration({ tenantId: query.tenantId });

  const { access_token: accessToken, id_token: idToken } = query;

  const userInfo = handleUserInfo(idToken, accessToken, config);
  const userInfoAccessToken = userDataFromToken(accessToken);

  console.log(`user info from icann`, userInfo);

  const {
    sub: id,
    email,
    given_name: firstName,
    family_name: lastName,
    name,
  } = userInfo;

  const {
    given_name: firstNameAccessToken,
    family_name: lastNameAccessToken,
  } = userInfoAccessToken;

  const emailsFormatted = email ? [email] : [];

  const serviceData = {
    id,
    firstName: firstNameAccessToken || firstName || name,
    lastName: lastNameAccessToken || lastName,
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
    if (!idToken) {
      throw new Error(`Authorization failed. Token ID not present.`);
    }

    return userDataFromToken(idToken);
  }
  if (!userInfoUrl) {
    throw new Error(`Authorization failed. User Info URL not present.`);
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
    throw Object.assign(
      new Error(`Authorization failed. Failed to fetch user data.`),
      { response: error.response }
    )
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
      throw new Error(`Authorization failed. Failed to parse user data.`);
    }
  }
};

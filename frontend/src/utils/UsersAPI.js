/**
 * Function to sign up a new user with the backend.
 * @param {*} firstname - User's first name.
 * @param {*} lastname  - User's last name.
 * @param {*} email     - User's mail address.
 * @param {*} phone     - User's phone number.
 * @param {*} password  - User's password.
 * @returns Object containing firstname, lastname, email address and auth token
 */
const signup = async (firstname, lastname, email, phone, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        password,
      }),
    }
  );
  return response.json();
};

/**
 * Function to login user.
 * @param {*} email     - User's email address.
 * @param {*} password  - User's password.
 * @returns Object containing firstname, lastname, email address and auth token. Error if authentication fails.
 */
const login = async (email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
  if (response.status === 401 || response.status === 400) {
    throw new Error("Authentication failed");
  }
  return response.json();
};

export { signup, login };

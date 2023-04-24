/**
 * Function to fetch all listings.
 * @returns Array of objects containing all listings.
 */
const fetchAll = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log("Something went wrong querying the backend API.");
    return "No listings found";
  }
};

/**
 * Function to fetch all of a user's own listings.
 * @param {*} userId
 * @returns Array of objects containing the user's listings.
 */
const fetchOwn = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log("Something went wrong querying the backend API.");
    return "No listings found";
  }
};

/**
 * Function to create a new listing.
 * @param {*} token
 * @param {*} userId
 * @param {*} title
 * @param {*} description
 * @param {*} price
 * @param {*} pictureUrl
 * @returns Object containing the created listing.
 */
const createListing = async (
  token,
  userId,
  title,
  description,
  price,
  pictureUrl
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          title: title,
          description: description,
          price: price,
          picture_url: pictureUrl,
        }),
      }
    );
    if (response.status !== 201) {
      return [];
    }
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { fetchAll, fetchOwn, createListing };

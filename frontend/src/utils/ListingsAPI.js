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

export { fetchAll, fetchOwn };

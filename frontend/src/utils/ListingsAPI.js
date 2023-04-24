const fetchAll = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  return response.json();
};

const fetchOwn = async (userId) => {
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
};

export { fetchAll, fetchOwn };
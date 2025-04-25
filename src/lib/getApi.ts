export const fetchData = async (url: string, setter: (data: never) => void) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    setter(data);
  } finally {
    setLoading(false);
  }
};

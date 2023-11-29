import axios from "axios";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { search } = await body;

    const options = {
      method: "GET",
      url: "https://google-search74.p.rapidapi.com/",
      params: {
        query: search,
        limit: "300",
        related_keywords: "true",
      },
      headers: {
        "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
        "X-RapidAPI-Host": "google-search74.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(options);
      // console.log(response.data);
      return new Response(
        JSON.stringify({ success: true, data: response.data }),
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ success: false, data: [], error: err }),
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.log(err.response.data.error.errors);
    return new Response(
      JSON.stringify({ success: false, data: [null], error: err }),
      {
        status: 200,
      }
    );
  }
};

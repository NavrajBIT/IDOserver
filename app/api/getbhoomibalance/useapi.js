import React from "react";

const useapi = () => {
  const API_URL = "/api/";
  async function crud(requestMethod, endpoint, data) {
    const requestOptions = {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };

    try {
      const response = await fetch(API_URL + endpoint + "/", requestOptions);

      if (response.status === 401) {
        throw 401;
      }

      if (requestMethod === "DELETE") return { status: response.status };

      const responseData = await response.json();

      if (responseData["status"]) {
        responseData["modelStatus"] = responseData["status"];
      }
      responseData["status"] = response.status;
      return responseData;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  return { crud };
};

export default useapi;

import { auth } from "express-oauth2-jwt-bearer";

export const authMiddleware = auth({
  audience: "https//bookings-api", // e.g. https://bookkings-api
  issuerBaseURL: `https://dev-xtgdrd6laklrwy8u.us.auth0.com/`,
});

// print token for testing
const options = {
  method: "POST",
  url: "https://dev-xtgdrd6laklrwy8u.us.auth0.com/oauth/token",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    client_id: "V9kXNe65441BntFf8PHfDOqm5C88PBeE",
    client_secret:
      "M1JEbWJIRmZCxCd7AvNp74BdqXoZ-ZJKbO_wOnTJO9GBqz4rudFU_UrT-RE1M6Zt",
    audience: "https//bookings-api",
    grant_type: "client_credentials",
  }),
};
fetch("https://dev-xtgdrd6laklrwy8u.us.auth0.com/oauth/token", options)
  .then((response) => response.json())
  .then((data) => {
    //uncomment this line to see the token token will also be print in console and postman
    //console.log(data); 
  })
  .catch((error) => {
    console.error("Error:", error);
  });

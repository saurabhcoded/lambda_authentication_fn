import { authenticateHandler, LoginEvent } from "./authenticateHandler";
import { getWeatherHandler } from "./weatherDataHandler";
import { getWeatherWithRetryHandler } from "./weatherDataRetryHandler";
import { authorizerHandler } from "./authorizeHandler";

export const handler = async (event: any) => {
  console.log("raw event", event);
  try {
    const { path } = event;

    if (path === "/authenticate") {
      return authenticateHandler(event.body as LoginEvent);
    }

    const isauthorised = authorizerHandler(event);

    if (!isauthorised) {
      return {
        statusCode: 400,
        body: { success: false, message: "User not authorised!" }
      };
    }

    if (path === "/weather") {
      return getWeatherHandler(event.body);
    }

    if (path === "/weather/retry") {
      return getWeatherWithRetryHandler(event.body);
    }

    if (path === "/protected") {
      return authorizerHandler(event);
    }

    return {
      statusCode: 404,
      body: { success: false, message: "Route not found" }
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: { success: false, message: "something went wrong!" }
    };
  }
};

export const authorizerHandler = async (event: any) => {
  const token = event.headers?.authorization?.replace("Bearer ", "");

  if (token === "validToken123") {
    return true;
  }

  return false;
};

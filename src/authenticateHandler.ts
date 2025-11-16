export interface LoginEvent {
  email?: string;
  password?: string;
}

const validateEmailAddress = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};


export const authenticateHandler = (event:LoginEvent) => {
    if (!event?.email || !event?.password) {
      return {
        statusCode: 404,
        body: {
          success: false,
          message: "Email or password not found!",
        },
      };
    }

    const valid =
      validateEmailAddress(event.email) && validatePassword(event.password);

    if (!valid) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: "Invalid email or password",
        },
      };
    }

    const generatedToken = "mockToken123";

    return {
      statusCode: 200,
      body: {
        success: true,
        token: generatedToken,
        message: "Logged in Successfully",
      },
    };
}
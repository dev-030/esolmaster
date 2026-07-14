import { NextRequest, NextResponse } from "next/server";

export async function handleRefresh(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // 1. Manually get the refresh token from the browser's request
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("No refresh token found in cookies");
    }

    // 2. Perform the server-to-server call
    const response = await fetch(`${backendUrl}/auth/refresh_token`, {
      method: "POST", // Ensure this is definitely POST
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
        "Content-Type": "application/json",
      },
      // Important: Ensure no redirection magic is happening
      redirect: "follow",
      body: JSON.stringify({}), // Even an empty body can help some parsers identify it as POST
    });

    console.log(`Refresh token response status: ${response.status}`);

    if (!response.ok) {
      // ADD THESE LOGS:
      const errorText = await response.text();
      console.error(`Backend responded with status: ${response.status}`);
      console.error(`Backend error message: ${errorText}`);
      throw new Error("Backend refresh call failed");
    }

    // 3. Get the "Set-Cookie" header sent by your NestJS backend
    const setCookieHeader = response.headers.get("set-cookie");
    console.log(setCookieHeader, "Set-Cookie header from backend");
    if (!setCookieHeader)
      throw new Error("Backend did not return a new cookie");

    // 4. Create the response to continue the navigation
    const nextResponse = NextResponse.next();

    // 5. Forward the new accessToken to the browser
    // We parse the string "accessToken=xyz; Path=/; ..." to get just "xyz"
    const tokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
    if (tokenMatch) {
      const tokenValue = tokenMatch[1];

      nextResponse.cookies.set("accessToken", tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Silent Refresh Error:", error);
    // If anything fails, send them to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

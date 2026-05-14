import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { resendEmailVerificationForUser } from "@/app/lib/email-verification";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "You need to sign in before requesting another verification email.",
      },
      { status: 401 }
    );
  }

  const result = await resendEmailVerificationForUser(user.id);

  if (result.status === "already-verified") {
    return NextResponse.json({
      success: true,
      message: "Your email is already verified.",
    });
  }

  if (result.status === "rate-limited") {
    return NextResponse.json(
      {
        success: false,
        message: "A verification email was sent recently. Please wait a few minutes.",
      },
      { status: 429 }
    );
  }

  if (result.status === "not-found") {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process this verification request.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Verification email sent. Check your inbox and spam folder.",
  });
}

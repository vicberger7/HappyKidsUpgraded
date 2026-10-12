// supabaseLoginService.js

import { supabase } from "./supabaseClient";

export async function loginWithSupabase(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: "Login failed",
    };
  }
}
export async function logoutFromSupabase() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Password reset email sent. Please check your email.",
    };
  } catch (err) {
    console.error("Reset password error:", err);

    return {
      success: false,
      message: "Failed to send password reset email.",
    };
  }
}
const loginGoogle = async ({ sb }) => {
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "google",
  });
  return { data, error };
};

const loginEmail = async ({ sb, email, password, captchaToken }) => {
  console.log(captchaToken);
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });
  return { data, error };
};

export { loginGoogle, loginEmail };

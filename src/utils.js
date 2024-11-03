import axios from "axios";
import { redirect } from "react-router-dom";

export async function requireAuth(request) {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (!isLoggedIn) {
    const response = redirect(`/login`);
    throw response;
  }
  return null;
}
export async function teleMessage(name, link, additional) {
  const url = `https://api.telegram.org/bot${
    process.env.VITE_BOT_FATHER_TOKEN
  }/sendMessage?chat_id=${
    process.env.VITE_TELE_GROUP_ID
  }&text=${name}%0A%0A${link}%0A%0A${additional ? additional : ""}`;
  await fetch(url);
}

export async function shortUrl(name, asin, additional) {
  const url = `https://bodz-server.vercel.app/api/shortUrl/${asin}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    const link = data.shortLink;
    console.log(link);
    teleMessage(name, link, additional);
    // teleMessage(
    //   name,
    //   `https://best-online-dealz.vercel.app/offers/${asin}`,
    //   additional
    // );
  } catch (error) {
    console.error("Error fetching short URL:", error);
  }
}

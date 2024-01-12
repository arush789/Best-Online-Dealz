import { redirect } from "react-router-dom";

export async function requireAuth(request) {
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!isLoggedIn) {
        const response = redirect(`/login`)
        throw response
    }
    return null
}
export async function teleMessage(name,link,additional){
    const url = `https://api.telegram.org/bot${process.env.VITE_BOT_FATHER_TOKEN}/sendMessage?chat_id=${process.env.VITE_TELE_GROUP_ID}&text=${name}%0A%0A${link}%0A%0A${additional}`
    await fetch(url, {
        headers: {
            "access-control-allow-origin": "*"
        }
    })
} 

export async function shortUrl(name,asin,additional){
    const url = `https://cutt.ly/api/api.php?key=${process.env.VITE_CUTLY_KEY}&short=https://best-online-dealz.vercel.app/offers/${asin}`
    const res = await fetch(url)
    const data = await res.json()
    const link = data.url.shortLink
    teleMessage(name,link,additional)
}





import { redirect } from "react-router-dom";

export async function requireAuth(request) {
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!isLoggedIn) {
        const response = redirect(`/login`)
        throw response
    }
    return null
}
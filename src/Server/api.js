export async function getAllOffers() {
    const url = "/api/offers"
    const res = await fetch(url)
    if (!res.ok) {
        throw {
            message: "Failed to fetch Offers",
            statusText: res.statusText,
            status: res.status
        }
    }
    const data = await res.json()
    return data.offers
}
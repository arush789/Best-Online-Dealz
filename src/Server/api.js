import { sql } from '@vercel/postgres';

export async function getAllOffers() {
    const url = "/api/offers"
    const res = await fetch(url)
    if (!res.ok) {
        throw {
            message: "Failed to fetch ffers",
            statusText: res.statusText,
            status: res.status
        }
    }
    const data = await res.json()
    return data.offers
}

export async function getOffer(id) {
    const url = `/api/offers/${id}`
    const res = await fetch(url)
    if (!res.ok) {
        throw {
            message: "Failed to fetch offer.",
            statusText: res.statusText,
            status: res.status
        }
    }
    const data = await res.json()
    return data.offers
}

export async function getTable() {
    const { rows } = await sql`SELECT * FROM products`;
    return rows;
}

export async function delRow(id){
    
}
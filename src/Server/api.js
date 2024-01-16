import { sql } from '@vercel/postgres';


export async function getTable() {
    const { rows } = await sql`SELECT * FROM products ORDER BY id`;
    return rows;
}

export async function delRow(id) {
    await sql`DELETE FROM products WHERE id=${id}`
    window.location.reload(false);
}

export async function addRow(name, asin) {
    await sql`INSERT INTO products (name,asin) VALUES (${name} , ${asin});`
    // setTimeout(() => {
    //     window.location.reload(false);
    // }, 1000);
}

export async function getUsers() {
    const { rows } = await sql`SELECT * FROM users`;
    // console.log(rows[0]);
    return rows;
}


export async function getOtherOffers() {
    const { rows } = await sql`SELECT * FROM otherproducts`
    return rows;
}

export async function getOtherOfferDetail(id) {
    const { rows } = await sql`SELECT * FROM otherproducts WHERE id=${id}`
    // console.log(rows)
    return rows;
}

export async function addOtherRow(title, description, price, imageurl, affiliatelink) {
    await sql`INSERT INTO otherproducts (title, description, price, imageurl, affiliatelink) VALUES (${title}, ${description}, ${price}, ${imageurl}, ${affiliatelink});`
}

export async function delOtherRow(id) {
    await sql`DELETE FROM otherproducts WHERE id=${id}`
    window.location.reload(false);
}


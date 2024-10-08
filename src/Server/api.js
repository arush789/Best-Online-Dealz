import { sql } from '@vercel/postgres';


export async function getTable() {
    const { rows } = await sql`SELECT * FROM products ORDER BY id`;
    return rows;
}

export async function delRow(id) {
    await sql`DELETE FROM products WHERE id=${id}`
    window.location.reload(false);
}

export async function addRow(name, asin, categories) {
    await sql`INSERT INTO products (name, asin, category) VALUES (${name}, ${asin}, ${categories});`;
    const { rows } = await sql`SELECT * FROM products WHERE name=${name} AND asin=${asin}`;
    return rows;
}

export async function getUsers() {
    const { rows } = await sql`SELECT * FROM users`;
    // console.log(rows[0]);
    return rows;
}






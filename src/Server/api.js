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
    setTimeout(() => {
        window.location.reload(false);
    }, 1000);
}

export async function getUsers() {
    const { rows } = await sql`SELECT * FROM users`;
    // console.log(rows[0]);
    return rows;
}






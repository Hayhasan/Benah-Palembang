/**
 * Header internal yang dipasang `src/proxy.ts` pada setiap request.
 *
 * Disimpan terpisah agar dapat diimpor proxy maupun kode server tanpa ikut
 * menarik `next/headers` atau modul `server-only` ke bundle proxy.
 */
export const REQUEST_PATH_HEADER = "x-pathname"

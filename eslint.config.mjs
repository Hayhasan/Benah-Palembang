import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Proyek Vite lama, disimpan sebagai referensi selama migrasi.
    "benah-palembang-legacy-vite/**",
    // Snapshot project original hanya digunakan sebagai referensi UI.
    "benah-palembang-original-project/**",
  ]),
  {
    // Kode yang dipindahkan apa adanya dari proyek Vite. Proyek lama tidak
    // menjalankan ESLint sama sekali, jadi temuan di bawah ini diwarisi, bukan
    // regresi migrasi. Diturunkan ke peringatan supaya tetap terlihat tanpa
    // memaksa penulisan ulang ~8.900 baris UI yang harus tampil identik.
    // Kode baru (src/app, src/lib) tetap dinilai ketat.
    // Lihat MIGRATION_PLAN.md bagian "Utang teknis yang diwarisi".
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/context/**/*.{ts,tsx}",
      "src/features/**/*.{ts,tsx}",
      "src/hooks/**/*.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;

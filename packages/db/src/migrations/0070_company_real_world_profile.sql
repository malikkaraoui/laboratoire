-- Profil "vraie entreprise" pour le mode laboratoire CEO :
-- cloner une société réelle (secteur, présence web, KBIS) dans Paperclip
-- pour tester des décisions avant de les prendre dans la vraie vie.

ALTER TABLE "companies" ADD COLUMN "sector" text;
ALTER TABLE "companies" ADD COLUMN "website_url" text;
ALTER TABLE "companies" ADD COLUMN "github_url" text;
ALTER TABLE "companies" ADD COLUMN "kbis_siret" text;
ALTER TABLE "companies" ADD COLUMN "siret_verified" boolean NOT NULL DEFAULT false;

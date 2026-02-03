# Next.js 15 & PayloadCMS 3.0 - ZADANIE REKRUTACYJNE

## Quick Start

Projekt jest gotowy do sprawdzenia zarówno w kodzie, jak i live na środowisku produkcyjnym (Vercel + Neon DB).

### Podgląd Live

- **Strona:** [LINK_DO_VERCELA] (np. https://twoj-projekt.vercel.app)
- **Panel Admina:** [LINK_DO_VERCELA]/admin
- **Login:** `sroczyk.arkadiusz@gmail.com`
- **Hasło:** `sroczykarkadiusz`

---

## Co zostało zrobione (Kluczowe decyzje)

- **Next.js 15 & Payload 3.0** - Świadomie wybrałem wersję 15 ze względu na pełną stabilność z Payloadem. Pominąłem wersję 16 (mimo że ma już nowe Cache Components), bo na tym etapie generowała konflikty z bibliotekami. Docelowo warto to zmigrować, ale w zadaniu nie chciałem tracić czasu na walkę z niestabilnym ekosystemem...
- **Warstwa danych (DAL)** - Cała logika wyciągania danych z Payloada jest zamknięta w osobnych funkcjach (Data Access Layer). Dzięki temu komponenty są czyste, a my mamy jedno scentralizowane miejsce do zarządzania zapytaniami.
- **Cachowanie (On-demand ISR)** - Użyłem `unstable_cache` i tagów. Wszystko odświeża się automatycznie dzięki hookom `afterChange` w Payloadzie. Zmiany w panelu są widoczne od razu, przy jednoczesnym zachowaniu szybkości statycznej strony.
- **Next.js 15 patterns** - Dopilnowałem, żeby `params` i `searchParams` były obsługiwane jako Promise. To wazna zmiana w wersji 15, bez której aplikacja rzucałaby błędy w runtime.
- **Bezpieczeństwo akcji** - Formularz kontaktowy posiada walidację Zod po stronie serwera oraz prosty rate limiter (oparty o IP w pamięci), co chroni projekt przed podstawowym spamem i botami.
- **SEO & Metadata** - Zaimplementowałem dynamiczne `generateMetadata`, dzięki czemu każda strona (newsy, kategorie) posiada unikalne tagi SEO pobierane bezpośrednio z CMS.
- **Podgląd (Draft Mode)** - Zrobiłem działający mechanizm draftów zintegrowany z Next.js. Edytor może podejrzeć posty przed ich oficjalną publikacją.
- **i18n** - Użyłem `next-intl` do międzynarodizacji. Wszystkie teksty są w plikach JSON, a zapytania do Payloada uwzględniają aktualny `locale`, co pozwala na łatwe skalowanie o kolejne języki.
- **Tooling** - Projekt ma włączone rygorystyczne typowanie (`strict: true`) oraz skonfigurowany ESLint/Prettier, co zapewnia czystość kodu od samego początku.

## 🛠️ Świadome uproszczenia (Możliwości rozwoju)

Poniższe rzeczy pominąłem celowo, skupiając się na architekturze serwerowej w wyznaczonym czasie:

- **Dynamiczne strony w CMS** - Obecnie strony są w kodzie dla lepszego typowania. W pełnej wersji dodałbym kolekcję `Pages` (Page Builder), aby klient mógł sam budować podstrony z klocków (Lexical blocks).
- **Live Preview** - Mamy solidny fundament pod Draft Mode. Pełne wizualne Live Preview (okno w oknie w panelu admina) to świetny dodatek "nice-to-have" dla wygody klienta w przyszłości oczywiście.
- **Role i uprawnienia** - Jest prosty podział Admin/User. Przy większym projekcie wdrożyłbym pełne RBAC (field-level access) dla edytorów i autorów.
- **Media Storage** - Zdjęcia są obecnie uploadowane bezpośrednio do Payloada. Docelowo sugeruję zewnętrzny storage (S3/Cloudinary/Vercel Blob) dla lepszej wydajności.
- **Skalowalny limiter** - In-memory limiter wystarcza na start, ale na produkcji (Vercel) przeszedłbym na Redis/Upstash, aby limity były spójne między instancjami serwera.
- **Integracje Formularzy** - Brak wysyłki maili (np. Resend/SendGrid). Obecnie zgłoszenia trafiają tylko do bazy w CMS, ale wystarczy dopiąć providera w Server Action i tyle.
- **Spam Protection** - Oprócz rate limitu, w przyszłości warto dodać Honeypot lub Cloudflare Turnstile dla pełnej ochrony formularzy.
- **Testy** - Jest gotowy setup pod Vitest i Playwright z przykładowymi testami.

## 📦 Główne paczki

- **Framework:** Next.js 15 (App Router)
- **CMS:** PayloadCMS 3.0 (Local API)
- **Database:** PostgreSQL (Neon)
- **i18n:** next-intl
- **Validation:** Zod
- **Testing:** Vitest, Playwright

# Filmes alkalmazás: https://cinema-pal.herokuapp.com/

Napjainkban világszerte az egyik legszórakoztatóbb és legközkedveltebb szabadidős tevékenység a filmek és filmsorozatok nézése.
Ezek online módon, akár otthonról is kényelmesen és gyorsan, csupán néhány egérkattintással elérhetőek filmes adatbázisokból.
Mivel magam is nagyon szeretem a filmeket, úgy döntöttem, hogy hozzájárulok egy ilyen témájú projekttel a nagyközönség igényeinek a kiszolgálásához.

Ebben a webes alkalmazásban felhasználók regisztrálhatnak, rendezőkre és filmekre kereshetnek rá, melyeket meg is nézhetnek.

## 1. Az alkalmazás elindítása terminálból

### Dockerrel

- Docker telepítése szükséges a futtatáshoz: https://docs.docker.com/get-docker/ (docker compose automatikusan települ)
- Docker képfájlok létrehozása és konténerekben futtatása: `npm run docker:up`
- A http://localhost:3000 -es url-en futtatható is az alkalmazás.

Megjegyzés:

- Leállítása: `npm run docker:down`
- Az alkalmazás a mongoDB Atlas-szal dolgozik, viszont a teszt-esetek a konténerben futtatott mongo adatbázishoz kapcsolódnak.

Tesztek futtatása:

- Külön terminálban: `npm run test`

### Docker nélkül

- npm start

## 2. Entitások

### User

Egy felhasználó, aki regisztrál az alkalmazásba, megadva nevét, nemét, születési évét, email címét és jelszavát.
(A jelszó hash-elve kerül elmentésre az adatbázisban.)
Regisztráció és belépés után látható, hogy mely filmeket tekintette már meg.
Továbbá megnézheti a kiválasztott filmet, amely bekerül a megnézett filmjeinek listájába.
Ilyen módon, egy user-hez több film is tartozhat.

### Movie

Egy film, amelynél a címe és egy releváns kép mellett látható, hogy milyen kategóriába és korosztályba tartozik, az időtartama, hogy ki rendezte, illetve a tartalmának rövid leírása.
Egy filmet több user is megnézhet.

### Director

Egy rendező személy adatai, aki egy vagy több filmet rendezett.
Rendelkezik névvel, képpel, születési évvel, egy rövid történettel és az általa rendezett filmek azonosítóinak listájával.
Egy rendezőhöz több film is tartozhat.

### Token

Hozzáférést szabályzó stringek, melyek kódolt információkat tartalmaznak a tulajdonosáról. Ezáltal azonosítva őt és így hozzáférést engedélyezve vagy megtiltva a különböző végpontok meghívásakor.

## 3. Feladatok

### A felhasználó regisztrál és/vagy belép az alkalmazásba

- Főoldal képernyő elkészítése `Regisztráció` és `Bejelentkezés` gombokkal
- Regisztrációs képernyő elkészítése navigációs gombokkal
- API regisztrációs végpont implementálása (POST /register)
- Bejelentkezési képernyő elkészítése navigációs gombokkal
- API bejelentkezési végpont implementálása a bejelentkezéshez és a felhasználó által már megtekintett filmek lekérdezéséhez (POST /login)
- Autentikáció és autorizáció implementálása
- API végpont implementálása a hozzáférési token frissítéséhez (POST /refresh)
- API kijelentkezési végpont implementálása (POST /logout)

### A felhasználó látja az általa már megnézett filmeket

- Megnézett filmek képernyő elkészítése

### A felhasználó rákeres filmekre vagy egy rendezőre és filmjeire

- Kereső képernyő elkészítése
- API végpont implementálása az összes film vagy akár cím, kategória és rendező szerinti lekérdezéséhez (GET /movies, GET /movies/{attribute}/{value})
- API végpont implementálása egy rendező és filmjei lekérdezéséhez (GET /directors/{name})

### A felhasználó kiválaszthat egy filmet

- Film találati képernyő elkészítése
- Rendező találati képernyő elkészítése

### A felhasználó látja a kiválasztott film adatait

- Film-részletező képernyő elkészítése
- API végpont implementálása a filmek megtekintéséhez (PUT /users/{userId}/{movieId}) (user megkapja a megnézett film id-ját(feltétel))

## 4. Képernyők

### Főoldal

A felhasználó itt a főképernyőt látja, amelyen egy `Regisztráció` és egy `Bejelentkezés` gombot talál.
Az adott gomb megnyomásával a megfelelő oldalra navigálhat.
Az alap állapota kijelentkezett módban érhető el. Azonban az alkalmazás frissítésekor is ide navigál a még mindig bejelentkezett felhasználó, de ekkor egy tájékozató üzenetet és egy `Kijelentkezés` gombot talál. Ilyenkor ki kell jelentkeznie, majd újra be, ha folytatni akarja a tevékenységét.

### Regisztráció

A felhasználó létrehozhatja a felhasználói fiókját ,megadva nevét, nemét, születési évét, email címét és jelszavát.
Hibás formátumú adat megadásánál hibaüzenetet kap a user és javíthatja a beviteli mező tartalmát.
A regisztrációt a `Regisztráció` gomb megnyomásával aktiválhatja.
Ezután a regisztráció sikerességéről tájékoztatást kap és a `Tovább` gomb megnyomásával a bejelentkezés oldalra navigál.

### Bejelentkezés

A korábban már regisztrált felhasználó bejelentkezhet az e-mail címének és jelszavának a megadásával és a `Bejelentkezés` gomb megnyomásával.
Ha ez sikeresen megtörtént, automatikusan az általa már megnézett filmek képernyőre navigál, üdvözlő üzenettel.
Ha pedig nem, arról értesítést kap a rendszertől.
Csak kijelentkezett állapotban érhető el.

### Megnézett filmek

Miután sikeresen bejelentkezett a felhasználó, itt láthatja az általa már megtekintett filmeket egy táblázatban.
Ennek értelmében látható a filmek képe, címe, kategóriája, korosztály besorolása, és hogy ki rendezte őket.
Továbbá, az itt lévő navigációs sávban található egy `Kijelentkezés` és egy `Keresés` gomb.
Az előbbivel kijelentkezhet és a főoldalra juthat, míg az utóbbival a keresési képernyőre juthat el.
Csak bejelentkezett állapotban érhető el.

### Keresési képernyő

A bejelentkezett felhasználó rá tud keresni filmekre egy általa megadott tulajdonnságuk szerint, ami lehet cím, kategória, rendező vagy akár az adatbázisban létező összes film.
Továbbá lehetőség van egy rendező adatainak és ezzel együtt az általa rendezett filmek keresésére is.
Mindemelett, itt is megtalálható a `Kijelentkezés` és a megnézett filmek képernyőre átirányító `Vissza` gombok.
Az itt található `Keresés` gombokra kattintva a film találati képernyő, illetve a rendező találati képernyő jelenik meg.
Csak bejelentkezett állapotban érhető el.

### Film találati képernyő

A felhasználó ezen a képernyőn láthatja a keresési kritériumnak megfelelő találatokat, adatainak megjelenítésével együtt. Ha rákattint a filmek valamelyikére, akkor a megfelelő film részletező képernyője jelenik meg.
Csak bejelentkezett állapotban érhető el.

### Rendező találati képernyő

A felhasználó ezen a képernyőn láthatja a keresett rendező képét és az adatait, az általa rendezett filmekkel együtt. Itt is van lehetősége megnyitni egy film részletező képernyőjét.
Csak bejelentkezett állapotban érhető el.

### Részletező képernyő

A felhasználó részletesebb információkat, képet és leírást láthat a kiválasztott filmről.
Az itt található `X` gombra kattintva, bezárhatja ezt a felugró képernyőt, visszajutva az előzőleg frissített találati oldalhoz.
Mindamellett a szintén itt található `Megnézem` gombra kattintva, megnézheti az adott filmet.
Miután megnézte, automatikusan visszanavigál az általa már megtekintett filmek listájához, frissítve az újonnan látott filmmel együtt.
Csak bejelentkezett állapotban érhető el.

## 5. API végpontok

```
- POST /register - A felhasználó regisztrál
- POST /login - A felhasználó bejelentkezik
- POST /refresh - A felhasználó hozzáférési tokene frissül
- POST /logout - A felhasználó kijelentkezik
- PUT /users/{userId}/{movieId} - A felhasználó által megnézett film hozzáadása a megnézett filmek listájához ha még nincs benne
- GET /movies - Az összes film lekérdezése
- GET /movies/{attribute}/{value} - Filmek lekérdezése egy tulajdonnság és értéke szerint
- GET /directors/{name} - Egy rendező és az általa rendezett filmek lekérdezése
```

## 6. Openapi dokumentáció

Az alkalmazás swagger dokumentációja a szerver alól futtatható az alábbi végponton:

```
- https://cinema-pal.herokuapp.com/api-doc
```

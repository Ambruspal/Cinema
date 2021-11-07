# Filmes alkalmazás: https://cinema-pal.herokuapp.com/

# Swagger link: https://cinema-pal.herokuapp.com/api-doc

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

import express from "express";
import exphbs from "express-handlebars";
import { connect, end, query } from "./db.js";

const PORT = 3000;
const WEB = "web";

const app = express();

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      dateFormat: (date) => {
        if (date instanceof Date) {
          let year = "0000" + date.getFullYear();
          year = year.substr(-4);
          let month = "00" + (date.getMonth() + 1);
          month = month.substr(-2);
          let day = "00" + date.getDate();
          day = day.substr(-2);
          return `${year}-${month}-${day}`;
        }
        return date;
      },
    },
  }),
);
app.set("view engine", "handlebars");

app.use(express.static(WEB, {
  index: ["index.html"],
}));
app.use(express.urlencoded({
  extended: true,
}));

app.get("/cekiai", async (req, res) => {
  let conn;
  try {
    conn = await connect();
    const { results: cekiai } = await query(
      conn,
      `
    select
      id, data, parduotuve
    from cekiai
    order by
      data, parduotuve`,
    );
    res.render("cekiai", { cekiai });
  } catch (err) {
    res.render("klaida", { err });
  } finally {
    await end(conn);
  }
});

app.get("/tipai", async (req, res) => {
  let conn;
  try {
    conn = await connect();
    const { results: tipai } = await query(
      conn,
      `
    select
      id, pavadinimas
    from tipai
    order by
      pavadinimas`,
    );
    res.render("tipai", { tipai });
  } catch (err) {
    res.render("klaida", { err });
  } finally {
    await end(conn);
  }
});

app.listen(PORT, () => {
  console.log(`Apskaita app listening at http://localhost:${PORT}`);
});

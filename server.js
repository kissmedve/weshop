require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// connect to mongodb
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database successfully connected");
});

// routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// views
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    helpers: {
      prevPage: function (currentUrl, currentPage) {
        currentPage = parseInt(currentPage);
        if (currentPage > 1) {
          prevPage = currentPage - 1;
        } else {
          prevPage = undefined;
        }
        if (prevPage !== undefined) {
          return `<li><a href="${currentUrl}${prevPage}" class="pagination-link"
        aria-label="Go to Page ${prevPage}" aria-current="page">&lt;</a></li>`;
        }
      },
      nextPage: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (currentPage < pages) {
          nextPage = currentPage + 1;
        } else {
          nextPage = undefined;
        }
        if (nextPage !== undefined) {
          return `<li><a href="${currentUrl}${nextPage}" class="pagination-link"
        aria-label="Go to Page ${nextPage}" aria-current="page">&gt;</a></li>`;
        }
      },
      pagin_1: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (pages <= 5) {
          pagin_1 = 1;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage >= 2) {
          pagin_1 = currentPage - 2;
        } else if (pages > 5 && currentPage <= 2) {
          pagin_1 = 1;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage < 2) {
          pagin_1 = pages - 4;
        }
        const isCurrent = pagin_1 === currentPage ? "is-current" : null;
        return `<li><a href="${currentUrl}${pagin_1}" class="pagination-link ${isCurrent}"
        aria-label="Go to Page ${pagin_1}" aria-current="page">${pagin_1}</a></li>`;
      },

      pagin_2: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (pages < 2) {
          pagin_2 = undefined;
        } else if (pages > 1 && pages <= 5) {
          pagin_2 = 2;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage >= 2) {
          pagin_2 = currentPage - 1;
        } else if (pages > 5 && currentPage <= 2) {
          pagin_2 = 2;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage < 2) {
          pagin_2 = pages - 3;
        }
        const isCurrent = pagin_2 === currentPage ? "is-current" : null;
        if (pagin_2 !== undefined) {
          return `<li><a href="${currentUrl}${pagin_2}" class="pagination-link ${isCurrent}"
        aria-label="Go to Page ${pagin_2}" aria-current="page">${pagin_2}</a></li>`;
        }
      },
      pagin_3: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (pages < 3) {
          pagin_3 = undefined;
        } else if (pages > 2 && pages <= 5) {
          pagin_3 = 3;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage >= 2) {
          pagin_3 = currentPage;
        } else if (pages > 5 && currentPage <= 2) {
          pagin_3 = 3;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage < 2) {
          pagin_3 = pages - 2;
        }
        const isCurrent = pagin_3 === currentPage ? "is-current" : null;
        if (pagin_3 !== undefined) {
          return `<li><a href="${currentUrl}${pagin_3}" class="pagination-link ${isCurrent}"
        aria-label="Go to Page ${pagin_3}" aria-current="page">${pagin_3}</a></li>`;
        }
      },
      pagin_4: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (pages < 4) {
          pagin_4 = undefined;
        } else if (pages > 3 && pages <= 5) {
          pagin_4 = 4;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage >= 2) {
          pagin_4 = currentPage + 1;
        } else if (pages > 5 && currentPage <= 2) {
          pagin_4 = 4;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage < 2) {
          pagin_4 = pages - 1;
        }
        const isCurrent = pagin_4 === currentPage ? "is-current" : null;
        if (pagin_4 !== undefined) {
          return `<li><a href="${currentUrl}${pagin_4}" class="pagination-link ${isCurrent}"
        aria-label="Go to Page ${pagin_4}" aria-current="page">${pagin_4}</a></li>`;
        }
      },
      pagin_5: function (currentUrl, currentPage, pages) {
        currentPage = parseInt(currentPage);
        pages = parseInt(pages);
        if (pages < 5) {
          pagin_5 = undefined;
        } else if (pages > 4 && pages <= 5) {
          pagin_5 = 5;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage >= 2) {
          pagin_5 = currentPage + 2;
        } else if (pages > 5 && currentPage <= 2) {
          pagin_5 = 5;
        } else if (pages > 5 && currentPage > 2 && pages - currentPage < 2) {
          pagin_5 = pages;
        }
        const isCurrent = pagin_5 === currentPage ? "is-current" : null;
        if (pagin_5 !== undefined) {
          return `<li><a href="${currentUrl}${pagin_5}" class="pagination-link ${isCurrent}"
        aria-label="Go to Page ${pagin_5}" aria-current="page">${pagin_5}</a></li>`;
        }
      },
      selectedTags: function (selectedTags) {
        let selected = [];
        if (selectedTags.data.root.selectedTags !== undefined) {
          // selectedTags is typeof Object (looking like an array),
          // but we need an array:
          let select = Object.values(selectedTags.data.root.selectedTags);
          // if selectedTags consists of only 1 value,
          // we get back an array of its characters,
          // so we need to recombine them
          let selectValue = "";
          select.map((item) => {
            if (item.length === 1) {
              selectValue += item;
            }
          });
          if (selectValue.length > 1) {
            select = [selectValue];
          }
          select.map((tag) => {
            switch (tag) {
              case "egg":
                tag = " EGG";
                break;
              case "ugo":
                tag = " UGO";
                break;
              case "lebensmittel":
                tag = " Lebensmittel";
                break;
              case "drogerie":
                tag = " Drogerie";
                break;
              case "trockenvorraete":
                tag = " Trockenvorräte";
                break;
              case "nuessetrockenobst":
                tag = " Nüsse/Trockenobst";
                break;
              case "konserven":
                tag = " Konserven";
                break;
              case "brotaufstrich":
                tag = " Brotaufstrich";
                break;
              case "teekaffee":
                tag = " Tee/Kaffee";
                break;
              case "suesswaren":
                tag = " Süßwaren";
                break;
              case "knabberzeug":
                tag = " Knabberzeug";
                break;
              case "kaese":
                tag = " Käse";
                break;
              case "milchprodukte":
                tag = " Milchprodukte";
                break;
              case "wurstwaren":
                tag = " Wurstwaren";
                break;
              case "fleisch":
                tag = " Fleisch";
                break;
              case "fisch":
                tag = " Fisch";
                break;
              case "brot":
                tag = " Brot";
                break;
              case "gemueseobst":
                tag = " Gemüse/Obst";
                break;
              case "tiefkuehlwaren":
                tag = " Tiefkühlprodukte";
                break;
              case "alkoholika":
                tag = " Alkoholika";
                break;
              case "sonstiges":
                tag = " Sonstiges";
                break;
              case "hygiene":
                tag = " Hygiene";
                break;
              case "hautpflege":
                tag = " Hautpflege";
                break;
              case "makeup":
                tag = " Makeup";
                break;
              case "haarpflege":
                tag = " Haarpflege";
                break;
              case "putzenwaschen":
                tag = " Putzen/Waschen";
                break;
              case "haushalt":
                tag = " Haushalt allgemein";
                break;
              default:
                tag = null;
            }
            selected.push(tag);
          });
        }
        return selected;
      },
      selectedShop: function (selectedShop) {
        let selected = [];
        if (selectedShop.data.root.selectedShop !== undefined) {
          // selectedShop is typeof Object (looking like an array),
          // but we need an array:
          let select = Object.values(selectedShop.data.root.selectedShop);

          // if selectedShop consists of only 1 value (it does),
          // we get back an array of its characters,
          // so we need to recombine them
          let selectValue = "";
          if (select === undefined) {
            selected = [];
          } else {
            select.map((item) => {
              if (item.length === 1) {
                selectValue += item;
              }
            });
            if (selectValue.length > 1) {
              select = [selectValue];
            }
            select.map((item) => {
              if (item === "dm") {
                item = "DM";
              } else if (item === "mytime") {
                item = "MyTime";
              } else if (item === "rewe") {
                item = "Rewe";
              }
              selected.push(item);
            });
          }
        }

        return selected;
      },
    },
  })
);

// port
const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

# WeShop

WeShop is designed to help with **joint online shopping** for everyday goods **where one of the parties doesn't have access to the internet**.

**_Please note:
This application is a working proof of concept and therefore has a number of features hardcoded into it, f.e. user names or product categories._**

## How it works

- Find one or several shops that cover most of what you need on a regular basis, and benefit from free shipping above a minimum order amount and the ease of use that comes with knowing the offered product range.

- Browse the targeted shop and bookmark every product you might want to order in the future.

- Export the bookmarks into a JSON file - every shop gets its own file.

- Adjust the scraping code according to the html structure of the targeted product pages. This step must be done manually before the import can be started. The sample files may serve as a starting point.

- **_---> /upload_**
  Import the product data.
  The data is being imported into a mongodb database.
  The import can be repeated as often as new/additional data or updates are needed.

- **_---> /tagsedit_**
  Assign the relevant categories to every product.

- **_---> /products_**
  View the product listings in end user mode.

- **_---> /products/admin_**
  View the product listings in admin mode.

- In both views listings can be filtered by shop, user, and categories. The titles are linked to the respective shop pages.

- From the /products view the output can be printed to a pdf to give to or print out for a non internet access user.
  Export per product group and either zip up the created files or shuffle them into a joint pdf.

- From the admin view products can be deleted from the database, edited, and added to the "cart list".

- **_---> /cartlist_**
  Build a "cart list" of ordered products to help with bill handling.
  Add products simply by clicking the respective buttons on the products/admin view.
  On the cart list itself add the amounts per user.
  Add custom positions like shipping or discounts at the bottom of the form.
  The program will calculate the needed subtotals and totals per user.

- The cart list is being stored in local storage at any point, so line items, amounts and custom positions are preserved between sessions.
  However, line items can be deleted by clicking on the respective button at the end of the line.

- Clicking the "start a new list" button on the products/admin page will delete all line items.

- You can print the cart list.

- Create a .csv file of all database entries as a backup or to migrate data.

## Known issues

Scraping shop sites needs manual work:

- Some shops update prices (maybe other features, too) by replacing the url of the phased out product by the url of the current product, resulting in a dead end link.
  DM f.e. gives a redirection statement coupled with a link to the new URL.
  Importing the changed product could be automated by checking if such a statement exists, identifying and following the new link and running the import as usual. Although in the given setting this level of automation doesn't make sense.

- Some shops (f.e. Mytime) include/exclude products dynamically depending on availability. So a product imported into the database 2 weeks ago might no longer been shown today.
  The best way to handle this is to keep all products in the database (or at least in a backup).

In some cases it's even hard to pull out all needed information.

- REWE f.e. is a big national network of shops, they have you enter the place you intend to shop at (curbside pickup or delivery service) first, and only then give you access to the products display.
  It's not possible to scrape prices by URL alone, while it's perfectly fine to pull the products themselves. To get the prices you would have to beat the intricate user monitoring via cookies and localstorage.

## Used Tech

**Backend**: Node, Express, Handlebars, Json2Csv
**Database**: MongoDB, Mongoose,
**Scraping**: Puppeteer,
**Frontend**: JS (ES5), Bulma

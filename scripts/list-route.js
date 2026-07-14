/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(process.cwd(), "src/app");

function scan(dir, route = "", groups = []) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // route group
      if (item.startsWith("(") && item.endsWith(")")) {
        scan(fullPath, route, [...groups, item]);
      }
      // normal route
      else {
        scan(fullPath, `${route}/${item}`, groups);
      }
    }

    if (item === "page.tsx" || item === "page.jsx") {
      console.log({
        route: route || "/",
        groups,
        file: fullPath.replace(process.cwd(), ""),
      });
    }
  });
}

scan(APP_DIR);
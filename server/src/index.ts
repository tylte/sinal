import { getServer } from "./utils/server";

const port = 4000;
getServer().listen(port, () => {
  console.log(`Server listening to port ${port}`);
});

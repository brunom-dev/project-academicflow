import { app } from "./app";

const PORT = process.env.BACK_END_PORT;

app.listen(PORT, () => {
    console.log(`\nServidor ON...`);
});
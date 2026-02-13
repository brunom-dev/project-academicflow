import { app } from './app';



const PORT = 8080;

app.listen(PORT, () => {
    console.log(`\nServidor rodando em http://localhost:${PORT}`);
})
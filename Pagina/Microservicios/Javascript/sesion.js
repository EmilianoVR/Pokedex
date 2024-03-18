const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const secretKey = 'clave secreta'; // Clave secreta 

// Base de datos temporal de usuarios (simulada)
const users = [
    { id: 1, username: 'emiliano', password: 'tecmi2024', role: 'usuario' },
    { id: 2, username: 'admin', password: 'admincontraseña', role: 'admin' }
];


app.use(bodyParser.json());

// Ruta para la autenticación de usuarios (inicio de sesión)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Buscar usuario en la base de datos
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

    // Enviar token como respuesta
    res.json({ token });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
}

// Ruta protegida (requiere token válido)
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Ruta protegida', user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

import axios from "axios";

const URL = "https://fakestoreapi.com/users";
const LS_KEY = "clientes";



const getLS = () => {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveLS = (data) => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
};

export const getNextAvailableId = (clientes) => {
    const maxId = clientes
        .map(c => Number(c.id))
        .filter(n => !isNaN(n))
        .reduce((max, n) => Math.max(max, n), 0);

    return maxId + 1;
};

export const getClientes = async () => {
    const guardados = getLS();

    if (guardados.length > 0) {
        return guardados.filter(c => c.visible !== false);
    }

    const { data } = await axios.get(URL);

    const clientes = data.map(c => ({
        ...c,
        visible: true
    }));

    saveLS(clientes);

    return clientes;
};

export const agregarCliente = async (cliente) => {
    const clientes = getLS();

    try {
        const { data } = await axios.post(URL, cliente);
        console.log("POST /users - Respuesta API:", data);
    } catch (err) {
        console.warn("POST a la API falló, se guarda solo en LocalStorage:", err.message);
    }

    const nuevo = {
        ...cliente,
        id: getNextAvailableId(clientes),
        visible: true
    };

    clientes.push(nuevo);
    saveLS(clientes);

    return nuevo;
};

export const eliminarCliente = async (id) => {
    try {
        const { data } = await axios.delete(`${URL}/${id}`);
        console.log("DELETE /users/" + id + " - Respuesta API:", data);
    } catch (err) {
        console.warn("DELETE a la API falló, se elimina solo en LocalStorage:", err.message);
    }

    const clientes = getLS();

    const actualizados = clientes.map(c =>
        Number(c.id) === Number(id)
            ? { ...c, visible: false }
            : c
    );

    saveLS(actualizados);

    return true;
};

export const reiniciarClientes = async () => {
    localStorage.removeItem(LS_KEY);
    return await getClientes();
};

export const getClientePorId = async (id) => {
    try {
        const { data } = await axios.get(`${URL}/${id}`);
        console.log("GET /users/" + id + " - Respuesta API:", data);
    } catch (err) {
        console.warn("GET individual a la API falló, se usa LocalStorage:", err.message);
    }

    const clientes = getLS();

    return clientes.find(c => Number(c.id) === Number(id) && c.visible !== false);
};
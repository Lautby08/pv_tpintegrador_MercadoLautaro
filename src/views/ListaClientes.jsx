import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioCliente from "../components/common/FormularioCliente";
import '../css/ListaClientes.css';
import { getClientes, agregarCliente, reiniciarClientes} from "../services/clienteService";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    CircularProgress, Alert, Button
} from '@mui/material';

const Clientes = () => {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("todos");

   useEffect(() => {

    const cargar = async () => {

        try {

            setCargando(true);

            const data = await getClientes();

            setClientes(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setCargando(false);

        }

    };

    cargar();

}, []);

    return (
        
        <div id="formulario">
            <h1>Ahora estas en Clientes</h1>

            <div style={{ margin: '15px 0' }}>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={async () => {
                        const listaRestaurada = await reiniciarClientes();
                        setClientes(listaRestaurada);
                    }}
                    >
                    Restablecer datos
                </Button>
             </div>
            
            <FormularioCliente
            onAddCliente={async (nuevo)=>{

            await agregarCliente(nuevo);

            const lista = await getClientes();

            lista.sort((a,b)=>a.id-b.id);

            setClientes(lista);
            }}
            ></FormularioCliente>


           <div className="buscador-container">

    <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
    />

    <select
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="select-filtro"
    >
        <option value="todos">Todos</option>
        <option value="nombre">Nombre</option>
        <option value="apellido">Apellido</option>
        <option value="email">Email</option>
        <option value="ciudad">Ciudad</option>
        <option value="id">ID</option>
    </select>

</div>
            

            
            <div className="tabla-clientes-container">
                <h2 className="tabla-titulo">Clientes Registrados</h2>
                
                {cargando ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
                        <CircularProgress sx={{ color: '#00e676' }} />
                    </div>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                ) : (
                    <Table className="tabla-cyber">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes
                            .filter(cliente => {
                            const texto = busqueda.toLowerCase();

                            switch (filtro) {

                                case "nombre":
                                    return cliente.name.firstname
                                        ?.toLowerCase()
                                        .includes(texto);

                                case "apellido":
                                    return cliente.name.lastname
                                        ?.toLowerCase()
                                        .includes(texto);

                                case "email":
                                    return cliente.email
                                        ?.toLowerCase()
                                        .includes(texto);

                                case "ciudad":
                                    return cliente.address?.city
                                        ?.toLowerCase()
                                        .includes(texto);

                                case "id":
                                    return cliente.id
                                        .toString()
                                        .includes(texto);

                                default:
                                    return (
                                        cliente.name.firstname?.toLowerCase().includes(texto) ||
                                        cliente.name.lastname?.toLowerCase().includes(texto) ||
                                        cliente.email?.toLowerCase().includes(texto) ||
                                        cliente.address?.city?.toLowerCase().includes(texto) ||
                                        cliente.id.toString().includes(texto)
                                    );
                            }

                        })
                            .sort((a,b)=>a.id-b.id)
                            .map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>#{cliente.id}</TableCell>
                                    <TableCell className="nombre-cliente">
                                        {cliente.name?.firstname} {cliente.name?.lastname}
                                    </TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={() => navigate(`/clientes/${cliente.id}`)} 
                                            className="boton-cyber-ficha"
                                        >
                                            Ver Ficha →
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

export default Clientes;
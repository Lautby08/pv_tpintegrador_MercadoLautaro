import { useState } from "react";
import "../../css/FormularioCliente.css";

import {
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";

const FORM_INICIAL = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  street: "",
  number: "",
  city: "",
  zipcode: ""
};

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\+?[0-9\s-]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;
const CALLE_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/;
const ENTERO_POSITIVO = /^[0-9]+$/;
const ZIPCODE_REGEX = /^[a-zA-Z0-9\s-]+$/;

const validarCampo = (campo, valor, formCompleto) => {
  const v = valor.trim();

  switch (campo) {
    case "name":
      if (!v) return "El nombre es obligatorio";
      if (v.length < 2) return "Debe tener al menos 2 caracteres";
      if (v.length > 50) return "Máximo 50 caracteres";
      if (!SOLO_LETRAS.test(v)) return "Solo puede contener letras";
      return "";

    case "lastname":
      if (!v) return "El apellido es obligatorio";
      if (v.length < 2) return "Debe tener al menos 2 caracteres";
      if (v.length > 50) return "Máximo 50 caracteres";
      if (!SOLO_LETRAS.test(v)) return "Solo puede contener letras";
      return "";

    case "email":
      if (!v) return "El email es obligatorio";
      if (v.length > 100) return "Máximo 100 caracteres";
      if (!EMAIL_REGEX.test(v)) return "Email inválido";
      return "";

    case "phone": {
      if (!v) return "";
      if (!TELEFONO_REGEX.test(v))
        return "Solo números, espacios, guiones y un + inicial";
      const digitos = v.replace(/\D/g, "");
      if (digitos.length < 7 || digitos.length > 15)
        return "Debe tener entre 7 y 15 dígitos";
      return "";
    }

    case "street":
      if (!v) return "";
      if (v.length < 2) return "Debe tener al menos 2 caracteres";
      if (v.length > 80) return "Máximo 80 caracteres";
      if (!CALLE_REGEX.test(v)) return "Contiene caracteres no permitidos";
      return "";

    case "number":
      if (!v) return "";
      if (!ENTERO_POSITIVO.test(v)) return "Solo números enteros positivos";
      if (Number(v) < 1) return "Debe ser mayor a 0";
      if (v.length > 6) return "Máximo 6 dígitos";
      return "";

    case "city":
      if (!v) return "";
      if (v.length < 2) return "Debe tener al menos 2 caracteres";
      if (v.length > 50) return "Máximo 50 caracteres";
      if (!SOLO_LETRAS.test(v)) return "Solo puede contener letras";
      return "";

    case "zipcode":
      if (!v) return "";
      if (v.length < 3 || v.length > 10) return "Debe tener entre 3 y 10 caracteres";
      if (!ZIPCODE_REGEX.test(v)) return "Solo letras, números, espacios y guiones";
      return "";

    case "username":
      if (!v) {
        return formCompleto.password.trim() ? "El username es obligatorio si cargás una contraseña" : "";
      }
      if (v.length < 4) return "Debe tener al menos 4 caracteres";
      if (v.length > 20) return "Máximo 20 caracteres";
      if (!USERNAME_REGEX.test(v)) return "Solo letras, números, punto y guion bajo";
      return "";

    case "password": {
      if (!valor) {
        return formCompleto.username.trim() ? "La contraseña es obligatoria si cargás un username" : "";
      }
      if (/\s/.test(valor)) return "No puede contener espacios";
      if (valor.length < 6) return "Debe tener al menos 6 caracteres";
      if (valor.length > 30) return "Máximo 30 caracteres";
      if (!/[a-zA-Z]/.test(valor) || !/[0-9]/.test(valor))
        return "Debe incluir al menos una letra y un número";
      return "";
    }

    default:
      return "";
  }
};

const CAMPOS_BASICOS = ["name", "lastname", "email"];
const CAMPOS_AVANZADOS = ["phone", "street", "number", "city", "zipcode", "username", "password"];

const FormularioCliente = ({ onAddCliente }) => {
  const [modoAvanzado, setModoAvanzado] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevoForm = { ...form, [name]: value };
    setForm(nuevoForm);

    if (errores[name] !== undefined) {
      const nuevosErrores = { ...errores, [name]: validarCampo(name, value, nuevoForm) };
      if (name === "username" && errores.password !== undefined) {
        nuevosErrores.password = validarCampo("password", nuevoForm.password, nuevoForm);
      }
      if (name === "password" && errores.username !== undefined) {
        nuevosErrores.username = validarCampo("username", nuevoForm.username, nuevoForm);
      }
      setErrores(nuevosErrores);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value, form) }));
  };

  const validarFormulario = () => {
    const campos = modoAvanzado ? [...CAMPOS_BASICOS, ...CAMPOS_AVANZADOS] : CAMPOS_BASICOS;
    const nuevosErrores = {};
    campos.forEach((campo) => {
      nuevosErrores[campo] = validarCampo(campo, form[campo], form);
    });
    setErrores(nuevosErrores);
    return Object.values(nuevosErrores).every((msg) => !msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarMensaje("Error: Revisá los campos marcados en rojo");
      return;
    }

    try {
      const nuevoCliente = {
        name: {
          firstname: form.name.trim(),
          lastname: form.lastname.trim()
        },
        email: form.email.trim()
      };

      if (modoAvanzado) {
        nuevoCliente.phone = form.phone.trim() || undefined;
        nuevoCliente.username = form.username.trim() || undefined;
        nuevoCliente.password = form.password || undefined;
        nuevoCliente.address = {
          street: form.street.trim() || undefined,
          number: form.number.trim() ? Number(form.number.trim()) : undefined,
          city: form.city.trim() || undefined,
          zipcode: form.zipcode.trim() || undefined
        };
      }

      if (onAddCliente) {
        onAddCliente(nuevoCliente);
      }

      mostrarMensaje("Cliente creado correctamente");
      setForm(FORM_INICIAL);
      setErrores({});
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al crear cliente");
    }
  };

  const propsCampo = (name, label, extra = {}) => ({
    label,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: Boolean(errores[name]),
    helperText: errores[name] || " ",
    fullWidth: true,
    margin: "normal",
    ...extra
  });

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5">Alta de Cliente</Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField {...propsCampo("name", "Nombre *", { inputProps: { maxLength: 50 } })} />
          <TextField {...propsCampo("lastname", "Apellido *", { inputProps: { maxLength: 50 } })} />
          <TextField
            {...propsCampo("email", "Email *", {
              type: "email",
              inputProps: { maxLength: 100 }
            })}
          />

          <div className="toggle-avanzado-container">
            <button
              type="button"
              className={`toggle-avanzado-btn ${modoAvanzado ? "activo" : ""}`}
              onClick={() => setModoAvanzado(!modoAvanzado)}
            >
              {modoAvanzado ? "▲ Ocultar campos avanzados" : "▼ Modo Avanzado"}
            </button>
          </div>

          {modoAvanzado && (
            <div className="campos-avanzados visible">
              <Typography variant="subtitle2" className="seccion-titulo">
                Contacto
              </Typography>

              <TextField
                {...propsCampo("phone", "Teléfono", {
                  type: "tel",
                  inputProps: { maxLength: 20 }
                })}
              />

              <Typography variant="subtitle2" className="seccion-titulo">
                Dirección
              </Typography>

              <div className="campos-fila">
                <TextField {...propsCampo("street", "Calle", { inputProps: { maxLength: 80 } })} />
                <TextField
                  {...propsCampo("number", "Número", {
                    inputProps: { maxLength: 6, inputMode: "numeric" }
                  })}
                />
              </div>

              <div className="campos-fila">
                <TextField {...propsCampo("city", "Ciudad", { inputProps: { maxLength: 50 } })} />
                <TextField
                  {...propsCampo("zipcode", "Código Postal", { inputProps: { maxLength: 10 } })}
                />
              </div>

              <Typography variant="subtitle2" className="seccion-titulo">
                Credenciales
              </Typography>

              <div className="campos-fila">
                <TextField {...propsCampo("username", "Username", { inputProps: { maxLength: 20 } })} />
                <TextField
                  {...propsCampo("password", "Password", {
                    type: "password",
                    inputProps: { maxLength: 30 }
                  })}
                />
              </div>
            </div>
          )}

          <Button variant="contained" type="submit">
            Agregar Cliente
          </Button>
        </form>
      </Paper>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={mensaje.startsWith("Error") ? "error" : "success"}>{mensaje}</Alert>
      </Snackbar>
    </>
  );};

export default FormularioCliente;

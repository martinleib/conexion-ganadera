"use client";
import { useState } from "react";

export default function Form() {
  const [nombre, setNombre] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [arrayDamnificados, setArrayDamnificados] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");

  const buscarDamnificados = async (e) => {
    e.preventDefault();
    setSearched(false);
    setArrayDamnificados([]);
    setMessage("estoy inventandome los datos, ya voy!");

    try {
      const response = await fetch("/api/damnificados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          identificador,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setArrayDamnificados(data);
      } else {
        console.error(
          `Error fetching damnificados: ${response.status} ${response.statusText} from ${response.url}`
        );
      }

    } catch (error) {
      console.error("Error fetching damnificados:", error);
    } finally {
      setMessage("");
      setSearched(true);
    }
  };

  return (
    <>
      <form
        onSubmit={buscarDamnificados}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div className="text-center text-xl font-semibold text-gray-700">
          Buscador
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Nombre</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Identificador</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>

        <p className="text-center">
          Podés buscar por nombre o por identificador
        </p>
      </form>

      {message && (
        <section className="text-center my-5">
          <p className="font-bold">{message}</p>
        </section>
      )}

      {arrayDamnificados.length >= 1 && (
        <section className="text-center">
          <ul>
            {arrayDamnificados.map((damnificado) => (
              <li key={damnificado.dador} className="my-5">
                <p>ID: {damnificado.dador}</p>
                <p>Nombre: {damnificado.nombre}</p>
                <p>
                  Cantidad (presuntamente) robada: {damnificado.cantidad} USD
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {searched && arrayDamnificados.length === 0 && (
        <section className="text-center my-5">
          <p>
            No hay ningún damnificado con ese nombre o ID. Aparentemente a vos
            no te scammearon.
          </p>
          <p>Mazel tov! 🐄</p>
        </section>
      )}
    </>
  );
}

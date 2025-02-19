<script setup>
import { ref } from 'vue'

const nombre = ref('')
const identificador = ref('')
const arrayDamnificados = ref([])
const searched = ref(false)
const message = ref('')

const buscarDamnificados = async () => {
  searched.value = false
  arrayDamnificados.value = []
  message.value = 'estoy inventandome los datos, ya voy!'

  try {
    const response = await fetch('/api/damnificados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre.value,
        identificador: identificador.value,
      }),
    })

    if (response.ok) {
      arrayDamnificados.value = await response.json()
    } else {
      console.error('Error fetching damnificados:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching damnificados:', error)
  } finally {
    message.value = ''
    searched.value = true
  }
}
const submitForm = () => {
  buscarDamnificados()
}
</script>

<template>
  <form
    @submit.prevent="submitForm"
    class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4"
  >
    <div class="text-center text-xl font-semibold text-gray-700">Buscar Usuario</div>

    <div class="flex flex-col">
      <label class="text-gray-600 font-medium">Nombre</label>
      <input
        type="text"
        class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        v-model="nombre"
      />
    </div>

    <div class="flex flex-col">
      <label class="text-gray-600 font-medium">Identificador</label>
      <input
        type="number"
        class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        v-model="identificador"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Buscar
    </button>

    <p class="text-center">Podés buscar por nombre o por identificador</p>
  </form>

  <section v-if="message" class="text-center my-5">
    <p class="font-bold">{{ message }}</p>
  </section>

  <section v-if="arrayDamnificados.length >= 1" class="text-center">
    <ul>
      <li v-for="damnificado in arrayDamnificados" :key="damnificado.dador" class="my-5">
        <p>ID: {{ damnificado.dador }}</p>
        <p>Nombre: {{ damnificado.nombre }}</p>
        <p>Cantidad (presuntamente) robada: {{ damnificado.cantidad }} USD</p>
      </li>
    </ul>
  </section>
  <section v-else-if="searched && arrayDamnificados.length == 0" class="text-center my-5">
    <p>No hay ningún damnificado con ese nombre o ID. Aparentemente a vos no te scammearon.</p>
    <p>Mazel tov! 🐄</p>
  </section>
</template>

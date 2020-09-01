<template>
  <q-page class="flex flex-center">
    <q-btn label="click" @click="chama"></q-btn>
  </q-page>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'PageIndex',
  methods: {
    chama () {
      // this.$q.electron.ipcRenderer.emit('getSecurePassword')
      // this.$q.electron.ipcRenderer.send('async-message', 'Async message baby')
      // ipcRenderer.emit('getSecurePassword')
      // bconst reply = ipcRenderer.sendSync('sync-message', ['Sent from main Window'])
      // const message = `Synchronous message reply: ${reply}`
      // ipcRenderer.send('async-message', 'Async message baby')
      // alert(message)
      // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
      ipcRenderer.invoke('some-name', 'ping').then(res => console.log('invoke', res))
      /* ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg) // prints "pong"
      })
      ipcRenderer.send('asynchronous-message', 'ping') */
    }
  },
  mounted () {
    /* this.$q.electron.ipcRenderer.on('setSecurePassword', (event, code) => { alert(code); console.log(`codigo recebido ${code}`) })
    ipcRenderer.on('setSecurePassword', (event, code) => { alert(code); console.log(`codigo recebido ${code}`) })
    ipcRenderer.on('async-reply', (event, arg) => {
      const message = `Asynchronous message reply: ${arg}`
      alert(message)
    }) */
    ipcRenderer.on('notes2', (event, arg) => {
      const message = `Asynchronous message reply: ${arg}`
      alert(message)
    })
  }
}
</script>

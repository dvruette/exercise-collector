<template>
  <div id="app">
    <top-nav id="nav" />
    <div id="view">
      <router-view id="router" />
      <main-footer id="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'

@Component({
  components: { 'top-nav': Nav, 'main-footer': Footer }
})
export default class App extends Vue {}
</script>


<style lang="scss">
$green: rgb(28, 150, 75);
$orange: rgb(235, 152, 44);
$dark: #2c3e50;
$link-color: #178352;

body {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $dark;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#view {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;

  #router {
    flex: 1;
  }
}

p, h1, h2, h3, h4 {
  margin: 0;
}

a {
  text-decoration: none;
  color: $link-color;
  border-bottom: 1px solid rgba(29, 204, 116, 0);
  cursor: pointer;
  transition: .4s ease;
  
  &:hover {
    border-bottom-color: $link-color;
  }
}

input {
  box-sizing: border-box;
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid rgba(black, 0.2);
}

.badge {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;

    border-radius: 4px;
    padding: 1px 4px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: .3s ease;

    &.green {
        background-color: $green;
        color: white;
    }

    &.orange {
        background-color: $orange;
        color: white;
    }
}


.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: -1;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s ease;
    pointer-events: none;

    .popup-container {
      background-color: white;
      max-width: 860px;
      margin: 32px;
      padding: 24px;
      border-radius: 4px;
      border-radius: 4px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.2);
      padding: 24px;
      cursor: default;
      transform: translateY(-80px);
      transition: .3s ease;
    }

    &.show {
      z-index: 100;
      opacity: 1;
      pointer-events: all;

      .popup-container {
        transform: none;
      }
    }
}

</style>

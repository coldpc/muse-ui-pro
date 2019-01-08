<template>
  <!--two-line/three-line-->
    <mu-list toggle-nested dense>
      <mu-list-item button :ripple="false" nested :open="open === 'send'" @toggle-nested="open = arguments[0] ? 'send' : ''">
        <mu-list-item-action>
          <mu-icon value="send"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>Sent mail</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
        </mu-list-item-action>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 3</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
      <mu-list-item button :ripple="false" nested :open="open === 'drafts'" @toggle-nested="open = arguments[0] ? 'drafts' : ''">
        <mu-list-item-action>
          <mu-icon value="drafts"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>Drafts</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
        </mu-list-item-action>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 3</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
      <mu-list-item button :ripple="false" nested :open="open === 'inbox'" @toggle-nested="open = arguments[0] ? 'inbox' : ''">
        <mu-list-item-action>
          <mu-icon value="inbox"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>Inbox</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
        </mu-list-item-action>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 3</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
      <mu-list-item button :ripple="false" nested :open="open === 'stared'" @toggle-nested="open = arguments[0] ? 'stared' : ''">
        <mu-list-item-action>
          <mu-icon value="grade"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>Stared</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
        </mu-list-item-action>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 3</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
    </mu-list>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        open: 'send'
      }
    },

    computed:{
      ...mapGetters({
        "menuList": "menuList"
      })
    },

    methods: {

    }
  }
</script>

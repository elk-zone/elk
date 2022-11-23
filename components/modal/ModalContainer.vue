<script setup lang="ts">
import { isAccountSwitcherOpen, isSigninDialogOpen } from '~/composables/dialog'

const accounts = useAccounts()
</script>

<template>
  <ModalDrawer
    v-model="isAccountSwitcherOpen"
  >
    <div max-w-60rem mxa p4>
      <h1 text-2xl>
        Switch Account
      </h1>
      <template v-for="acc of accounts" :key="acc.id">
        <AccountInfo
          :account="acc.account"
          :link="false"
          :full-server="true"
          py4 border="b base"
          @click="loginTo(acc)"
        />
      </template>
      <div py2 mx--2>
        <button btn-text flex="~ gap-1" items-center @click="openSigninDialog">
          <div i-ri:user-add-line />
          Add another account
        </button>
      </div>
    </div>
  </ModalDrawer>
  <ModalDialog v-model="isSigninDialogOpen">
    <AccountSignIn m6 />
  </ModalDialog>
</template>

<script setup lang="ts">
import type { mastodon } from 'masto'
import { toggleBlockAccount, toggleFollowAccount, toggleMuteAccount, useRelationship } from '~~/composables/masto/relationship'

const { account, status } = defineProps<{
  account: mastodon.v1.Account
  status?: mastodon.v1.Status
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { client } = useMasto()

const step = ref('selectCategory')
const serverRules = ref((await client.value.v2.instance.fetch()).rules || [])
const reportReason = ref('')
const selectedRuleIds = ref([])
const availableStatuses = ref(status ? [status] : [])
const selectedStatusIds = ref(status ? [status.id] : [])
const additionalComments = ref('')
const forwardReport = ref(false)

const dismissButton = ref<HTMLDivElement>()

loadStatuses() // Load statuses asynchronously ahead of time

function categoryChosen() {
  step.value = reportReason.value === 'dontlike' ? 'furtherActions' : 'selectStatuses'
  resetModal()
}

async function loadStatuses() {
  if (status) {
    // Load the 5 statuses before and after the reported status
    const prevStatuses = await client.value.v1.accounts.listStatuses(account.id, {
      maxId: status.id,
      limit: 5,
    })
    const nextStatuses = await client.value.v1.accounts.listStatuses(account.id, {
      minId: status.id,
      limit: 5,
    })
    availableStatuses.value = availableStatuses.value.concat(prevStatuses)
    availableStatuses.value = availableStatuses.value.concat(nextStatuses)
  }
  else {
    // Reporting an account directly
    // Load the 10 most recent statuses
    const mostRecentStatuses = await client.value.v1.accounts.listStatuses(account.id, {
      limit: 10,
    })
    availableStatuses.value = mostRecentStatuses
  }
  availableStatuses.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function submitReport() {
  await client.value.v1.reports.create({
    accountId: account.id,
    statusIds: selectedStatusIds.value,
    comment: additionalComments.value,
    forward: forwardReport.value,
    category: reportReason.value === 'spam' ? 'spam' : reportReason.value === 'violation' ? 'violation' : 'other',
    ruleIds: reportReason.value === 'violation' ? selectedRuleIds.value : null,
  })
  step.value = 'furtherActions'
  resetModal()
}

function unfollow() {
  emit('close')
  toggleFollowAccount(useRelationship(account).value!, account)
}

function mute() {
  emit('close')
  toggleMuteAccount(useRelationship(account).value!, account)
}

function block() {
  emit('close')
  toggleBlockAccount(useRelationship(account).value!, account)
}

function resetModal() {
  // TODO: extract this scroll/reset logic into ModalDialog element
  dismissButton.value?.scrollIntoView() // scroll to top
}
</script>

<template>
  <div my-8 px-3 sm:px-8 flex="~ col gap-4" relative>
    <h2 mxa text-xl>
      {{ reportReason === 'dontlike' ? "Limiting" : "Reporting" }} <b text-primary>@{{ account.acct }}</b>
    </h2>
    <button ref="dismissButton" btn-action-icon absolute top--8 right-0 m1 aria-label="Close" @click="emit('close')">
      <div i-ri:close-line />
    </button>

    <template v-if="step === 'selectCategory'">
      <h1 mxa text-4xl mb4>
        Tell us what's wrong with this {{ status ? "post" : "account" }}
      </h1>
      <p text-xl>
        Choose the best match:
      </p>

      <div>
        <input id="dontlike" v-model="reportReason" type="radio" value="dontlike">
        <label pl-2 for="dontlike" font-bold>I don't like it</label>
        <p pl-6>
          It is not something you want to see
        </p>
      </div>

      <div>
        <input id="spam" v-model="reportReason" type="radio" value="spam">
        <label pl-2 for="spam" font-bold>It's spam</label>
        <p pl-6>
          Malicious links, fake engagement, or repetitive replies
        </p>
      </div>

      <div v-if="serverRules.length > 0">
        <input id="violation" v-model="reportReason" type="radio" value="violation">
        <label pl-2 for="violation" font-bold>It violates one or more of the server rules</label>
        <p v-if="reportReason === 'violation'" pl-6 pt-2 text-primary font-bold>
          Select all that apply:
        </p>
        <ul pl-6>
          <li v-for="rule in serverRules" :key="rule.id" pt-2>
            <input
              :id="rule.id"
              v-model="selectedRuleIds"
              type="checkbox"
              :value="rule.id"
              :disabled="reportReason !== 'violation'"
            >
            <label pl-2 :for="rule.id">{{ rule.text }}</label>
          </li>
        </ul>
      </div>

      <div>
        <input id="other" v-model="reportReason" type="radio" value="other">
        <label pl-2 for="other" font-bold>It's something else</label>
        <p pl-6>
          The issue does not fit into other categories
        </p>
      </div>

      <div v-if="reportReason && reportReason !== 'dontlike'">
        <h3 mt-8 mb-4 font-bold>
          Is there anything else you think we should know?
        </h3>
        <textarea v-model="additionalComments" w-full h-20 p-3 border placeholder="Additional Comments" />
        <div v-if="getServerName(account) && getServerName(account) !== currentServer">
          <h3 mt-8 mb-2 font-bold>
            The user you're reporting is from another server
          </h3>
          <p pb-1>
            Do you want to send an anonymized copy of this report to that server as well?
          </p>
          <input id="forward" v-model="forwardReport" type="checkbox" value="rule.id">
          <label pl-2 for="forward"><b>Yes, forward this report to {{ getServerName(account) }}</b></label>
        </div>
      </div>

      <button
        btn-solid mxa mt-10
        :disabled="!reportReason || (reportReason === 'violation' && selectedRuleIds.length < 1)"
        @click="categoryChosen()"
      >
        Next
      </button>
    </template>

    <template v-else-if="step === 'selectStatuses'">
      <h1 mxa text-4xl mb4>
        Are there any {{ status ? "other" : "" }} posts that back up this report?
      </h1>
      <p text-primary font-bold>
        Select all that apply:
      </p>
      <table>
        <tr v-for="availableStatus in availableStatuses" :key="availableStatus.id">
          <td>
            <input
              :id="availableStatus.id"
              v-model="selectedStatusIds"
              type="checkbox"
              :value="availableStatus.id"
            >
          </td>
          <td>
            <label :for="availableStatus.id">
              <StatusCard :status="availableStatus" :actions="false" pointer-events-none />
            </label>
          </td>
        </tr>
      </table>
      <button
        btn-solid mxa mt-5
        @click="submitReport()"
      >
        Submit Report
      </button>
    </template>

    <template v-else-if="step === 'furtherActions'">
      <h1 mxa text-4xl mb4>
        {{ reportReason === 'dontlike' ? "Don't want to see this?" : "Thanks for reporting, we'll look into this." }}
      </h1>
      <p text-xl>
        {{ reportReason === 'dontlike' ? "Here are your options for controlling what you see:" : "While we review this, here are the actions you can take:" }}
      </p>

      <div v-if="useRelationship(account).value?.following">
        <button btn-outline mxa mt-4 mb-2 @click="unfollow()">
          Unfollow <b>@{{ account.acct }}</b>
        </button><br>
        You will no longer see posts from this user in your home feed. You may still see posts from them elsewhere.
      </div>
      <div v-if="!useRelationship(account).value?.muting">
        <button btn-outline mxa mt-4 mb-2 @click="mute()">
          Mute <b>@{{ account.acct }}</b>
        </button><br>
        You will no longer see any posts from this user. They can still follow you and see your posts. They will not know that they are muted.
      </div>
      <div v-if="!useRelationship(account).value?.blocking">
        <button btn-outline mxa mt-4 mb-2 @click="block()">
          Block <b>@{{ account.acct }}</b>
        </button><br>
        You will no longer see any posts from this user. They will not be able to see your posts or follow you. They will be able to tell that they are blocked.
      </div>
      <button btn-solid mxa mt-10 @click="emit('close')">
        Done
      </button>
    </template>
  </div>
</template>

<style>
tr {
  border-bottom-width: 1px;
}

tr:last-child {
  border: none;
}

td {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

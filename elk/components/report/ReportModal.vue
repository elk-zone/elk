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
    const prevStatuses = await client.value.v1.accounts.$select(account.id).statuses.list({
      maxId: status.id,
      limit: 5,
    })
    const nextStatuses = await client.value.v1.accounts.$select(account.id).statuses.list({
      minId: status.id,
      limit: 5,
    })
    availableStatuses.value = availableStatuses.value.concat(prevStatuses)
    availableStatuses.value = availableStatuses.value.concat(nextStatuses)
  }
  else {
    // Reporting an account directly
    // Load the 10 most recent statuses
    const mostRecentStatuses = await client.value.v1.accounts.$select(account.id).statuses.list({
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
      <i18n-t :keypath="reportReason === 'dontlike' ? 'report.limiting' : 'report.reporting'">
        <b text-primary>@{{ account.acct }}</b>
      </i18n-t>
    </h2>
    <button ref="dismissButton" btn-action-icon absolute top--8 right-0 m1 :aria-label="$t('action.close')" @click="emit('close')">
      <div i-ri:close-line />
    </button>

    <template v-if="step === 'selectCategory'">
      <h1 mxa text-4xl mb4>
        {{ status ? $t('report.whats_wrong_post') : $t('report.whats_wrong_account') }}
      </h1>
      <p text-xl>
        {{ $t('report.select_one') }}
      </p>

      <div>
        <input id="dontlike" v-model="reportReason" type="radio" value="dontlike">
        <label pl-2 for="dontlike" font-bold>{{ $t('report.dontlike') }}</label>
        <p pl-6>
          {{ $t('report.dontlike_desc') }}
        </p>
      </div>

      <div>
        <input id="spam" v-model="reportReason" type="radio" value="spam">
        <label pl-2 for="spam" font-bold>{{ $t('report.spam') }}</label>
        <p pl-6>
          {{ $t('report.spam_desc') }}
        </p>
      </div>

      <div v-if="serverRules.length > 0">
        <input id="violation" v-model="reportReason" type="radio" value="violation">
        <label pl-2 for="violation" font-bold>{{ $t('report.violation') }}</label>
        <p v-if="reportReason === 'violation'" pl-6 pt-2 text-primary font-bold>
          {{ $t('report.select_many') }}
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
        <label pl-2 for="other" font-bold>{{ $t('report.other') }}</label>
        <p pl-6>
          {{ $t('report.other_desc') }}
        </p>
      </div>

      <div v-if="reportReason && reportReason !== 'dontlike'">
        <h3 mt-8 mb-4 font-bold>
          {{ $t('report.anything_else') }}
        </h3>
        <textarea v-model="additionalComments" w-full h-20 p-3 border :placeholder="$t('report.additional_comments')" />
        <div v-if="getServerName(account) && getServerName(account) !== currentServer">
          <h3 mt-8 mb-2 font-bold>
            {{ $t('report.another_server') }}
          </h3>
          <p pb-1>
            {{ $t('report.forward_question') }}
          </p>
          <input id="forward" v-model="forwardReport" type="checkbox" value="rule.id">
          <label pl-2 for="forward"><b>{{ $t('report.forward', [getServerName(account)]) }}</b></label>
        </div>
      </div>

      <button
        btn-solid mxa mt-10
        :disabled="!reportReason || (reportReason === 'violation' && selectedRuleIds.length < 1)"
        @click="categoryChosen()"
      >
        {{ $t('action.next') }}
      </button>
    </template>

    <template v-else-if="step === 'selectStatuses'">
      <h1 mxa text-4xl mb4>
        {{ status ? $t('report.select_posts_other') : $t('report.select_posts') }}
      </h1>
      <p text-primary font-bold>
        {{ $t('report.select_many') }}
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
        {{ $t('report.submit') }}
      </button>
    </template>

    <template v-else-if="step === 'furtherActions'">
      <h1 mxa text-4xl mb4>
        {{ reportReason === 'dontlike' ? $t('report.further_actions.limit.title') : $t('report.further_actions.report.title') }}
      </h1>
      <p text-xl>
        {{ reportReason === 'dontlike' ? $t('report.further_actions.limit.description') : $t('report.further_actions.report.description') }}
      </p>

      <div v-if="useRelationship(account).value?.following">
        <button btn-outline mxa mt-4 mb-2 @click="unfollow()">
          <i18n-t keypath="menu.unfollow_account">
            <b>@{{ account.acct }}</b>
          </i18n-t>
        </button><br>
        {{ $t('report.unfollow_desc') }}
      </div>
      <div v-if="!useRelationship(account).value?.muting">
        <button btn-outline mxa mt-4 mb-2 @click="mute()">
          <i18n-t keypath="menu.mute_account">
            <b>@{{ account.acct }}</b>
          </i18n-t>
        </button><br>
        {{ $t('report.mute_desc') }}
      </div>
      <div v-if="!useRelationship(account).value?.blocking">
        <button btn-outline mxa mt-4 mb-2 @click="block()">
          <i18n-t keypath="menu.block_account">
            <b>@{{ account.acct }}</b>
          </i18n-t>
        </button><br>
        {{ $t('report.block_desc') }}
      </div>
      <button btn-solid mxa mt-10 @click="emit('close')">
        {{ $t('action.done') }}
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

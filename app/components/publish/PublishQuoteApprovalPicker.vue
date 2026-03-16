<script setup lang="ts">
import type { mastodon } from 'masto'
import { statusQuoteApprovalPolicies } from '~/composables/masto/icons'

defineProps<{
  editing?: boolean
}>()

const modelValue = defineModel<string | null | undefined>({
  required: true,
})

const currentQuoteApprovalPolicy = computed(() =>
  statusQuoteApprovalPolicies.find(v => v.value === modelValue.value) || statusQuoteApprovalPolicies[0],
)

function chooseQuoteApprovalPolicy(quoteApprovalPolicy: mastodon.rest.v1.QuoteApprovalPolicy) {
  modelValue.value = quoteApprovalPolicy
}
</script>

<template>
  <div flex items-center>
    <div i-ri:double-quotes-l me--2 />
    <CommonTooltip placement="top" :content="editing ? $t(`quote_approval_policy.${currentQuoteApprovalPolicy.value}`) : $t('tooltip.change_quote_approval_policy')">
      <CommonDropdown placement="bottom">
        <slot :quote-approval-policy="currentQuoteApprovalPolicy" />
        <template #popper>
          <CommonDropdownItem
            v-for="quoteApprovalPolicy in statusQuoteApprovalPolicies"
            :key="quoteApprovalPolicy.value"
            :icon="quoteApprovalPolicy.icon"
            :text="$t(`quote_approval_policy.${quoteApprovalPolicy.value}`)"
            :description="$t(`quote_approval_policy.${quoteApprovalPolicy.value}_desc`)"
            :checked="quoteApprovalPolicy.value === modelValue"
            @click="chooseQuoteApprovalPolicy(quoteApprovalPolicy.value)"
          />
        </template>
      </CommonDropdown>
    </CommonTooltip>
  </div>
</template>

<script setup lang="ts">
import {
  banRule$,
  countdown$,
  manualSwitch$,
  reviewFlaggedUsers$,
  toggleReviewFlag,
} from '@/services/banRuleService';

import type { BanRule, ReviewMode } from '@/services/banRuleService';

import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Subscription } from 'rxjs';

const currentRule = ref<BanRule>({ match: 'includes', value: 'bot' });
const countdown = ref<number>(180);
const reviewFlag = ref<ReviewMode>('off');

const subscriptions: Subscription[] = [];

onMounted(() => {
  subscriptions.push(
    banRule$.subscribe(rule => (currentRule.value = rule)),
    countdown$.subscribe(val => (countdown.value = val)),
    reviewFlaggedUsers$.subscribe(mode => (reviewFlag.value = mode))
  );
});

onUnmounted(() => {
  subscriptions.forEach(sub => sub.unsubscribe());
});

const manualSwitch = () => manualSwitch$.next();
const toggleReview = () => toggleReviewFlag();

const ruleText = computed(() => {
  if (currentRule.value.value === 'bot') {
    return currentRule.value.match === 'includes'
      ? 'Banning users whose names include "bot" (Welcoming VIPs)'
      : 'Banning exact name "bot" (uncommon)';
  }
  if (currentRule.value.value === 'vip') {
    return currentRule.value.match === 'equals'
      ? 'Banning users named exactly "VIP" (Welcoming bots)'
      : 'Banning names that include "vip"';
  }
  return 'Unknown rule';
});
</script>

<template>
  <div class="ban-status-container">
    <p class="ban-status-row">
      <strong>Current Rule:</strong> {{ ruleText }}
    </p>

    <p class="ban-status-row">
      <strong>Time until next switch:</strong> {{ countdown }} seconds
    </p>

    <div class="ban-status-flex">
      <label for="reviewFlag" class="ban-status-label">Review Flagged Users</label>
      <input
        id="reviewFlag"
        type="checkbox"
        :checked="reviewFlag === 'on'"
        @change="toggleReview"
      />
    </div>

    <button class="ban-status-btn" @click="manualSwitch">
      Switch Now
    </button>
  </div>
</template>

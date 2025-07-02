
<script setup lang="ts">
import {
    banRule$,
    countdown$,
    manualSwitch$,
    reviewFlaggedUsers$,
    toggleReviewFlag,
} from '@/services/banRuleService';
import { ref, onMounted, onUnmounted } from 'vue';

const banRule = ref<'bot' | 'vip'>('bot');
const countdown = ref(180);
const reviewFlag = ref(false);

let sub1: any, sub2: any, sub3: any;

onMounted(() => {
    sub1 = banRule$.subscribe(value => (banRule.value = value));
    sub2 = countdown$.subscribe(value => (countdown.value = value));
    sub3 = reviewFlaggedUsers$.subscribe(val => (reviewFlag.value = val));
});

onUnmounted(() => {
    sub1?.unsubscribe();
    sub2?.unsubscribe();
    sub3?.unsubscribe();
});

const manualSwitch = () => manualSwitch$.next();
const toggleReview = () => toggleReviewFlag();
</script>
<template>
    <div class="ban-status-container">
        <p class="ban-status-row">
            <strong>Current Rule:</strong>
            <span v-if="banRule === 'bot'">Banning Bots, Welcoming VIPs</span>
            <span v-else>Banning VIPs, Welcoming Bots</span>
        </p>
        <p class="ban-status-row">
            <strong>Time until next switch:</strong> {{ countdown }} seconds
        </p>

        <div class="ban-status-flex">
            <label for="reviewFlag" class="ban-status-label">Review Flagged Users</label>
            <input id="reviewFlag" type="checkbox" v-model="reviewFlag" @change="toggleReview" />
        </div>

        <button class="ban-status-btn" @click="manualSwitch">
            Switch Now
        </button>
    </div>
</template>

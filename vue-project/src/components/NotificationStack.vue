
<script setup lang="ts">
import { notifications$ } from '@/services/notificationService';
import { ref, onMounted, onUnmounted } from 'vue';

const notifications = ref([]);

let sub: any;

onMounted(() => {
    sub = notifications$.subscribe(value => {
        notifications.value = value;
    });
});

onUnmounted(() => {
    sub?.unsubscribe();
});

const remove = (index: number) => {
    notifications$.next([
        ...notifications.value.slice(0, index),
        ...notifications.value.slice(index + 1),
    ]);
};

const getClass = (severity: string) => {
    switch (severity) {
        case 'error':
            return 'bg-error';
        case 'notice':
            return 'bg-notice';
        case 'trivial':
            return 'bg-trivial';
        default:
            return 'bg-default';
    }
};
</script>
<template>
    <div class="notification-stack">
        <div v-for="(notif, index) in notifications" :key="index"
            class="notification-item"
            :class="getClass(notif.severity)">
            <div class="notification-text">
                {{ new Date(notif.date).toLocaleTimeString() }} - {{ notif.reason }}
            </div>
            <button @click="remove(index)" class="notification-close">
                ✕
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { notifications$, dismissNotification } from '@/services/notificationService';
import type { Notification } from '@/services/notificationService';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const rawNotifications = ref<Notification[]>([]);

let sub: ReturnType<typeof notifications$.subscribe>;

onMounted(() => {
  sub = notifications$.subscribe(value => {
    rawNotifications.value = value;
  });
});

onUnmounted(() => {
  sub?.unsubscribe();
});

const visibleNotifications = computed(() =>
  rawNotifications.value.filter(n => !n.dismissed)
);

const remove = (index: number) => {
  dismissNotification(index); 
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
      <div
        v-for="(notif, index) in visibleNotifications"
        :key="notif.date"
        class="notification-item"
        :class="getClass(notif.severity)"
      >
        <div class="notification-text">
          {{ new Date(notif.date).toLocaleTimeString() }} - {{ notif.reason }}
        </div>
        <button @click="remove(index)" class="notification-close">✕</button>
      </div>
    </div>
  </template>
  

<script setup lang="ts">
import { users$, userCreated$, userRemoved$ } from '@/services/userService';
import { ref, onMounted, onUnmounted } from 'vue';

const users = ref([]);
const lastCreated = ref(null);
const lastRemoved = ref(null);

let subUsers: any, subCreated: any, subRemoved: any;

onMounted(() => {
    subUsers = users$.subscribe(value => (users.value = value));
    subCreated = userCreated$.subscribe(user => (lastCreated.value = user));
    subRemoved = userRemoved$.subscribe(user => (lastRemoved.value = user));
});

onUnmounted(() => {
    subUsers?.unsubscribe();
    subCreated?.unsubscribe();
    subRemoved?.unsubscribe();
});
</script>
<template>
    <div class="user-status-container">
        <p><strong>Total Users:</strong> {{ users.length }}</p>
        <p><strong>Last Created User:</strong> {{ lastCreated?.name }} ({{ lastCreated?.id }})</p>
        <p><strong>Last Removed User:</strong> {{ lastRemoved?.name }} ({{ lastRemoved?.id }})</p>
    </div>
</template>

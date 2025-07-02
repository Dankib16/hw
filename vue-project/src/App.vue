
<script setup lang="ts">
import NotificationStack from './components/NotificationStack.vue';
import UserStatus from './components/UserStatus.vue';
import BanRuleStatus from './components/BanRuleStatus.vue'; 

import './services/userReactions';
</script>
<template>
  <div>
    <h1>User Management System</h1>
    <BanRuleStatus /> 
    <UserStatus />
    <NotificationStack />
  
  </div>
</template>


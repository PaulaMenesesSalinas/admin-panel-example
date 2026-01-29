<script>
import AccountsTable from "./AccountsTable.vue";
import UsersTable from "./UsersTable.vue";

export default {
  name: "AdminPanel",
  components: {
    AccountsTable,
    UsersTable,
  },
  data() {
    return {
      search: "",
      accounts: [],
      selectedAccount: null,
    };
  },
  mounted() {
    const interval = setInterval(() => {
      const accounts = this.$refs.accountsTable?.getAccounts?.();
      if (accounts && accounts.length) {
        this.accounts = accounts;
        clearInterval(interval);
      }
    }, 300);
  },
};
</script>


<template>
  <div class="h-screen bg-gray-50 overflow-hidden">
    <div class="max-w-7xl mx-auto h-full p-6 flex flex-col">
      <!-- HEADER & SEARCH -->
      <div class="flex items-center gap-4 flex-none mb-4">
        <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <input
          v-model="search"
          placeholder="Search"
          class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200 text-sm flex-1"
        />
      </div>

      <!-- Main sections -->
      <div class="flex-1 flex flex-col gap-6 overflow-hidden">
        <AccountsTable
          ref="accountsTable"
          :search="search"
          @account-selected="selectedAccount = $event"
        />

        <hr class="my-2 h-0.5 border-t-0 bg-neutral-100" />

        <UsersTable :search="search" 
                    :selectedAccount="selectedAccount" 
                    :accounts="accounts" />
      </div>
    </div>
  </div>
</template>

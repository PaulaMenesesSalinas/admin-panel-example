<script>
import api from "../src/api.js";
import util from "../src/util.js";
import DataTable from "./DataTable.vue";
import AccountForm from "./AccountForm.vue";

export default {
  name: "AccountsTable",
  components: {
    DataTable,
    AccountForm,
  },
  props: {
    search: String,
  },
  emits: ["account-selected"],
  data() {
    return {
      accounts: [],
      selectedAccount: null,
      error: false,
    };
  },
  computed: {
    filteredAccounts() {
      let filtered = [...this.accounts];

      if (this.search) {
        const regex = new RegExp(this.search, "i");
        filtered = filtered.filter(
          (account) =>
            regex.test(account.company) || regex.test(account.id.toString())
        );
        return filtered.slice(0, 20);
      }

      return filtered;
    },
  },
  methods: {
  async loadAccounts(url = "api/admin.php?req=accounts") {
    try {
      const responseText = await api.get(url);
      const parsed = util.parseDsv(responseText, "\t") || []

      const booleanFields = [
        "analytics",
        "cmbs",
        "vehicles",
        "trucks",
        "transactions",
        "weather",
        "explorer",
        "dashboard",
        "reports",
      ];

      this.accounts = parsed.map((account) => {
        const clean = { ...account };
        clean.status = !clean.disabled;
        booleanFields.forEach((key) => {
          clean[key] = ["1", 1, true].includes(clean[key]);
        });
        return clean;
      });
    } catch (err) {
      this.error = "Failed to load accounts";
      console.error(err);
     // Re-throw the error so that the tests can detect it.
      throw err;
    }
  },

    selectAccount(account) {
      this.selectedAccount =
        this.selectedAccount?.id === account.id ? null : account;
      this.$emit("account-selected", this.selectedAccount);
    },

    editAccount(account) {
      this.$refs.accountForm.showForm(account);
    },

    saveAccount(account) {
      if (!account.id) {
        account.id = this.createAccount(account);
        this.accounts.push({ ...account });
      } else {
        this.updateAccount(account);
        const index = this.accounts.findIndex((a) => a.id === account.id);
        if (index !== -1) {
          this.accounts[index] = { ...account };
        }
      }
    },

    createAccount(account) {
      console.log("POST to create_account", account);
      const maxId = this.accounts.reduce((max, a) => Math.max(max, a.id || 0), 0);
      return maxId + 1;
    },

    updateAccount(account) {
      console.log("POST to update_account", account);
    },

    getAccounts() {
      return this.accounts;
    },
  },
  mounted() {
    if (process.env.NODE_ENV !== 'test') {
    this.loadAccounts()
  }
  },
};
</script>

<template>
  <section class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-2 flex-none mb-4">
      <h2 class="text-2xl font-semibold">Accounts</h2>
      <div class="ml-auto flex gap-2">
        <button
          :disabled="!selectedAccount"
          @click="$refs.accountForm.showForm(selectedAccount)"
          class="text-purple-600 hover:text-purple-700 text-3xl disabled:opacity-30"
          title="Edit Account"
        >
          <i class="mdi mdi-pencil-outline"></i>
        </button>
        <button
          @click="$refs.accountForm.showForm(null)"
          class="text-green-600 hover:text-green-700 text-3xl"
          title="Add Account"
        >
          <i class="mdi mdi-plus-circle-outline"></i>
        </button>
      </div>
    </div>

    <p v-if="error" class="text-red-600 flex-none mb-2">Error: {{ error }}</p>

    <!-- Table -->
    <div class="flex-1 overflow-auto">
      <DataTable
        :columns="[
          { name: 'ID', key: 'id' },
          { name: 'Company', key: 'company' },
          { name: 'Analytics', key: 'analytics' },
          { name: 'Max Tickers', key: 'max_tickers' },
          { name: 'CMBS', key: 'cmbs' },
          { name: 'Vehicles', key: 'vehicles' },
          { name: 'Trucks', key: 'trucks' },
          { name: 'Transactions', key: 'transactions' },
          { name: 'Weather', key: 'weather' },
          { name: 'Explorer', key: 'explorer' },
          { name: 'Dashboard', key: 'dashboard' },
          { name: 'Tokens', key: 'tokens' },
          { name: 'Reports', key: 'reports' },
        ]"
        :data="filteredAccounts"
        :selectedId="selectedAccount?.id"
        @row-click="selectAccount"
        @row-right-click="editAccount"
      />
    </div>

    <!-- Account Form -->
    <AccountForm ref="accountForm" @save="saveAccount" />
  </section>
</template>

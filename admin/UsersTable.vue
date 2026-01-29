<script>
import api from "../src/api.js";
import util from "../src/util.js";
import DataTable from "./DataTable.vue";
import UserForm from "./UserForm.vue";

export default {
  name: "UsersTable",
  components: {
    DataTable,
    UserForm,
  },
  props: {
    search: String,
    selectedAccount: Object,
    accounts: Array,
  },
  emits: ["save-user", "reset-password"],
  data() {
    return {
      users: [],
      selectedUser: null,
      error: false,
    };
  },
  computed: {
    filteredUsers() {
      let filtered = [...this.users];

      if (this.selectedAccount) {
        filtered = filtered.filter(
          (user) => user.account === this.selectedAccount.id
        );
      }

      if (this.search) {
        const regex = new RegExp(this.search, "i");
        filtered = filtered.filter(
          (u) =>
            regex.test(u.first_name) ||
            regex.test(u.last_name) ||
            regex.test(u.email)
        );
        return filtered.slice(0, 20);
      }

      return filtered;
    },
  },
  methods: {
    async loadUsers() {
      try {
        const responseText = await api.get("api/admin.php?req=users");
        const parsed = util.parseDsv(responseText, "\t");

        const booleanFields = [
          "disabled",
          "restricted",
          "restricted_apps",
          "show_all",
        ];

        this.users = parsed.map((user) => {
          const clean = { ...user };
          clean.status = !clean.disabled;
          booleanFields.forEach((key) => {
            clean[key] = ["1", 1, true].includes(clean[key]);
          });
          return clean;
        });
      } catch (err) {
        this.error = "Failed to load users";
        console.error(err);
      }
    },

    selectUser(user) {
      this.selectedUser =
        this.selectedUser?.id_user === user.id_user ? null : user;
    },

    editUser(user) {
      this.$refs.userForm.showForm(user, this.selectedAccount);
    },

    showPasswordDialog(user) {
      this.$refs.userForm.showForm(user);
      this.$refs.userForm.resetPassword();
    },

    saveUser(user) {
      if (!user.id_user) {
        user.id_user = this.createUser(user);
        this.users.push({ ...user });
      } else {
        this.updateUser(user);
        const index = this.users.findIndex((u) => u.id_user === user.id_user);
        if (index !== -1) {
          this.users[index] = { ...user };
        }
      }
    },

    createUser(user) {
      console.log("POST to create_user", user);
      const maxId = this.users.reduce((max, u) => Math.max(max, u.id_user || 0), 0);
      return maxId + 1;
    },

    updateUser(user) {
      console.log("POST to update_user", user);
    },

    resetPassword({ id, username, password }) {
      console.log("POST to reset_password", { id, username, password });
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>

<template>
  <section class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-2 flex-none mb-4">
      <h2 class="text-2xl font-semibold">Users</h2>
      <div class="ml-auto flex gap-2">
        <button
          :disabled="!selectedUser"
          @click="showPasswordDialog(selectedUser)"
          class="text-orange-500 hover:text-orange-600 text-3xl disabled:opacity-30"
          title="Reset Password"
        >
          <i class="mdi mdi-lock-reset"></i>
        </button>

        <button
          :disabled="!selectedUser"
          @click="editUser(selectedUser)"
          class="text-purple-600 hover:text-purple-700 text-3xl disabled:opacity-30"
          title="Edit User"
        >
          <i class="mdi mdi-pencil-outline"></i>
        </button>
        <button
          @click="$refs.userForm.showForm(null, selectedAccount)"
          class="text-green-600 hover:text-green-700 text-3xl"
          title="Add User"
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
          { name: 'ID', key: 'id_user' },
          { name: 'Email', key: 'email' },
          { name: 'First Name', key: 'first_name' },
          { name: 'Last Name', key: 'last_name' },
          { name: 'Profile', key: 'profile' },
          { name: 'Restricted', key: 'restricted' },
          { name: 'Restricted Apps', key: 'restricted_apps' },
          { name: 'Show All', key: 'show_all' },
        ]"
        :data="filteredUsers"
        :selectedId="selectedUser?.id_user"
        @row-click="selectUser"
        @row-right-click="editUser"
      />
    </div>

    <!-- User Form -->
    <UserForm
      ref="userForm"
      :accounts="accounts"
      @save="saveUser"
      @reset-password="resetPassword"
    />
  </section>
</template>
